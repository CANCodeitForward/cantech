/*
 * GET home page.
 */

var url = require('url');
var path = require('path');
var mysql = require('mysql');
var sanitizer = require('sanitizer');
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var config = require('../config.json');
var nodemailer = require('nodemailer');
var json2csv = require('json2csv');



// MySQL Config
var connection = mysql.createConnection({
    host     : config.MYSQL_HOST,
    user     : config.MYSQL_USER,
    password : config.MYSQL_PASSWORD
});

exports.sessions = function(req, res){
  var user_id = req.session.user_id;
  var user_type = req.session.user_type;
  var staff_id = req.session.staff_id;
  var volunteer_id = req.session.volunteer_id;
  var sql = null;

  if(user_type == "staff"){
    sql = 'SELECT staff_session.session_id as session_id FROM candb.staff_session WHERE staff_session.staff_id = ' + staff_id + ';';
  }else {
    sql = 'SELECT volunteer_session.session_id as session_id FROM candb.volunteer_session WHERE volunteer_session.volunteer_id = ' + volunteer_id + ';';
  }

  // First get all sessions that are assgined to the staff or volunteer
  var query = connection.query(sql, function(err, result) {   
    if (err) { 
      console.log(err);
      res.json({"message": "Something went wrong!", "results": null}, 500); 
    } else {
      if (result.length === 0) {
        res.json({"message": "No sessions or classes for " + user_type + " and staff_id " + staff_id + " : volunteer_id " + volunteer_id, "results": null}, 404); 
      } else {
        var session_ids = result.map(function(value) {
          return value.session_id;
        });

        // Manually stitch the classes for those sessions because we do not want duplicate session information
        sql = 'SELECT Session.id as session_id, Session.name as session_name, Session.datetime_start as session_start_date, Session.datetime_end as session_end_date, Session.description as session_description, Class.id AS class_id, Class.datetime_start as class_start_date, Class.datetime_end as class_end_date, Class.session_id, Venue.name as session_venue FROM candb_main.Session INNER JOIN candb_main.Class ON Class.session_id = Session.id INNER JOIN candb_main.Venue on Class.venue_id = Venue.id WHERE Session.id IN (' + session_ids.join(',') + ');';
        var query2 = connection.query(sql, function(err, result2) {

          result.forEach(function (currentValue) {
            currentValue.classes = result2.filter(function matchingSession(filterValue) {
             return filterValue.session_id == currentValue.session_id;
            });
          });
          // Return to view
          res.json({"message": "Successfully gathered sessions and classes", "results": result}, 200);
        });
      }
    }
  });
};

// Route to get all staff members registration and attendance info
exports.session_staff_registrations = function(req, res){

  var sessionid = req.params.sessionid;
  console.log('sessionid: ' + sessionid);
  var classid = req.params.classid;
  console.log('classid: ' + classid);

  if(!sessionid){
    res.json({ "message": "sessionid cannot be empty!", "status": "error"}, 404);
  }
  if(!classid){
    res.json({ "message": "classid cannot be empty!", "status": "error"}, 404);
  }

  // This SQL query returns all the staff members who are registered for a particular class
  var sql = 'SELECT staff.id as staff_id, staff.email, staff.first_name, staff.last_name, staff.phone_number FROM candb.staff INNER JOIN candb.staff_session ON staff_session.staff_id = staff.id WHERE staff_session.session_id =' + sessionid +';';
  var query = connection.query(sql, function(err, result) {   
    if (err) {
      console.log(err);
      res.json({"message": "Something went wrong!", "results": null}, 500);
    } else {
      if (result.length === 0) {
        res.json({"message": "No registrations found", "results": null}, 404);
      } else {
        // This SQL query returns all the workers who have signed in and signed out
        sql = 'SELECT staff_attendance.staff_id, staff_attendance.signin_time, staff_attendance.signout_time FROM candb.staff_attendance WHERE staff_attendance.class_id = ' + classid + ' ORDER BY staff_id;';
        var query2 = connection.query(sql, function(err, result2) {
          // We manually stitch the two results together because the two existing SQL queries are complicated enough
          result.forEach(function (currentValue) {
            var attendanceRecords = result2.filter(function matchingWorkers(filterValue) {
              return filterValue.staff_id == currentValue.staff_id;
            });

            currentValue.attendance = {};
            attendanceRecords.forEach(function(record) {
                currentValue.attendance = record;
            });

          });
          // Return to view
          res.json({"message": "Successfully gathered registrations and attendance", "results": result}, 200);
        });
      }
    }
  });
};

// Route to get all volunteer registration and attendance info
exports.session_volunteer_registrations = function(req, res){

  var sessionid = req.params.sessionid;
  console.log('sessionid: ' + sessionid);
  var classid = req.params.classid;
  console.log('classid: ' + classid);

  if(!sessionid){
    res.json({ "message": "sessionid cannot be empty!", "status": "error"}, 404);
  }
  if(!classid){
    res.json({ "message": "classid cannot be empty!", "status": "error"}, 404);
  }

  // This SQL query returns all the volunteers who are registered for a particular class
  var sql = 'SELECT volunteer.id as volunteer_id, volunteer.email, volunteer.first_name, volunteer.last_name, volunteer.phone_number FROM candb.volunteer INNER JOIN candb.volunteer_session ON volunteer_session.volunteer_id = volunteer.id WHERE volunteer_session.session_id =' + sessionid +';';
  var query = connection.query(sql, function(err, result) {   
    if (err) {
      console.log(err);
      res.json({"message": "Something went wrong!", "results": null}, 500);
    } else {
      if (result.length === 0) {
        res.json({"message": "No registrations found", "results": null}, 404);
      } else {
        // This SQL query returns all the workers who have signed in and signed out
        sql = 'SELECT volunteer_attendance.volunteer_id, volunteer_attendance.signin_time, volunteer_attendance.signout_time FROM candb.volunteer_attendance WHERE volunteer_attendance.class_id = ' + classid + ' ORDER BY volunteer_id;';
        var query2 = connection.query(sql, function(err, result2) {
          // We manually stitch the two results together because the two existing SQL queries are complicated enough
          result.forEach(function (currentValue) {
            var attendanceRecords = result2.filter(function matchingWorkers(filterValue) {
              return filterValue.volunteer_id == currentValue.volunteer_id;
            });

            currentValue.attendance = {};
            attendanceRecords.forEach(function(record) {
                currentValue.attendance = record;
            });

          });
          // Return to view
          res.json({"message": "Successfully gathered registrations and attendance", "results": result}, 200);
        });
      }
    }
  });
};

// Route to get all participant registration and attendance info
exports.session_participant_registrations = function(req, res){

  var sessionid = req.params.sessionid;
  console.log('sessionid: ' + sessionid);
  var classid = req.params.classid;
  console.log('classid: ' + classid);

  if(!sessionid){
    res.json({ "message": "sessionid cannot be empty!", "status": "error"}, 404);
  }
  if(!classid){
    res.json({ "message": "classid cannot be empty!", "status": "error"}, 404);
  }

  // This SQL query returns all the volunteers who are registered for a particular class
  var sql = 'SELECT User.id as participant_id, User.email_address, User.first_name, User.last_name, Phone.primary FROM candb_main.User INNER JOIN candb_main.Phone ON User.phone_id = Phone.id INNER JOIN candb_main.Registration ON User.id = Registration.user_id WHERE Registration.session_id =' + sessionid +';';
  var query = connection.query(sql, function(err, result) {   
    if (err) {
      console.log(err);
      res.json({"message": "Something went wrong!", "results": null}, 500);
    } else {
      if (result.length === 0) {
        res.json({"message": "No registrations found", "results": null}, 404);
      } else {
        // This SQL query returns all the workers who have signed in and signed out
        sql = 'SELECT participant_attendance.participant_id, participant_attendance.signin_time, participant_attendance.signout_time FROM candb.participant_attendance WHERE participant_attendance.class_id = ' + classid + ' ORDER BY participant_id;';
        var query2 = connection.query(sql, function(err, result2) {
          // We manually stitch the two results together because the two existing SQL queries are complicated enough
          result.forEach(function (currentValue) {
            var attendanceRecords = result2.filter(function matchingWorkers(filterValue) {
              return filterValue.participant_id == currentValue.participant_id;
            });

            currentValue.attendance = {};
            attendanceRecords.forEach(function(record) {
                currentValue.attendance = record;
            });

          });
          // Return to view
          res.json({"message": "Successfully gathered registrations and attendance", "results": result}, 200);
        });
      }
    }
  });
};

// Request JSON data: { "type": "signin/signout", "timestamp": "2015-07-26 15:39:06" }
// curl -H "Content-Type: application/json" -X POST -d '{ "type": "signin", "timestamp": "2015-07-26 15:39:06" }' http://localhost:3000/api/class/1/attendance_participant/1
exports.class_participant_attendance = function(req, res){

  var class_id = req.params.id;
  var participant_id = req.params.participant_id;
  var req_data = req.body;

  // we don't care about the actual date, just the hours/minutes
  var date = new Date();
  date.setHours(req_data.hour);
  date.setMinutes(req_data.minute);
  var type;

  if(req_data.type == "signin"){
    type = 1;
  }
  if(req_data.type == "signout"){
    type = 0;
  }

  // Prepare user data for DB insert 
  var values = { class_id: class_id, participant_id: participant_id, time: date, type: type };
  // Insert into MySQL
  var query = connection.query('INSERT INTO candb.participant_attendance SET ?', values, function(err, result) {
  if (err){ 
    console.log(err);
    console.log('Sign Up failed!');
    res.json(500, { error: 'Something really went wrong!'});
  }else{
    res.json({"message": "Signedin!", "results": result}, 200);
  }});

};

// Request JSON data: { "type": "signin/signout", "timestamp": "2015-07-26 15:39:06" }
// curl -H "Content-Type: application/json" -X POST -d '{ "type": "signin", "timestamp": "2015-07-26 15:39:06" }' http://localhost:3000/api/class/1/attendance_worker/1
exports.class_worker_attendance = function(req, res){

  var class_id = req.params.id;
  var worker_id = req.params.worker_id;
  var req_data = req.body;

  var date = new Date();
  date.setHours(req_data.hour);
  date.setMinutes(req_data.minute);
  var type;
  
  if(req_data.type == "signin"){
    type = 1;
  }
  if(req_data.type == "signout"){
    type = 0;
  }

  // Prepare user data for DB insert 
  var values = { class_id: class_id, worker_id: worker_id, time: date, type: type };
  // Insert into MySQL
  var query = connection.query('INSERT INTO candb.worker_attendance SET ?', values, function(err, result) {
  if (err){ 
    console.log('Attendance insert failed!');
    res.json(500, { message: 'Something really went wrong!' });
  }else{
    res.json({"message": "Signedin!", "results": result}, 200);
  }});

};

// Request JSON data: { "type": "signin/signout", "timestamp": "2015-07-26 15:39:06" }
// curl -H "Content-Type: application/json" -X PATCH -d '{ "type": "signin", "timestamp": "2015-07-26 15:39:06" }' http://localhost:3000/api/class/1/attendance_participant/1
exports.class_participant_attendance_update = function(req, res){

  var class_id = req.params.id;
  var participant_id = req.params.participant_id;
  var req_data = req.body;

  var type;

  var date = new Date();
  date.setHours(req_data.hour);
  date.setMinutes(req_data.minute);

  if(req_data.type == "signin"){
    type = 1;
  }
  if(req_data.type == "signout"){
    type = 0;
  }

  // Prepare user data for DB insert 
  var values = { class_id: class_id, participant_id: participant_id, time: date, type: type };
  // Update MySQL
  var query = connection.query('UPDATE candb.participant_attendance SET ? WHERE class_id = ? AND participant_id = ? AND type = ?', [values, class_id, participant_id, type], function(err, result) {
  if (err){ 
    console.log(err);
    console.log(query.sql);
    console.log('Attendance insert failed!');
    res.json(500, { message: 'Something really went wrong!'});
  }else{
      res.json({"message": "Attendance update complete!", "results": result}, 200);
  }});

};

// Request JSON data: { "type": "signin/signout", "timestamp": "2015-07-26 15:39:06" }
// curl -H "Content-Type: application/json" -X PATCH -d '{ "type": "signin", "timestamp": "2015-07-26 15:39:06" }' http://localhost:3000/api/class/1/attendance_worker/1
exports.class_worker_attendance_update = function(req, res){

  var class_id = req.params.id;
  var worker_id = req.params.worker_id;
  var req_data = req.body;

  // we don't care about the actual date, just the hours/minutes
  var date = new Date();
  date.setHours(req_data.hour);
  date.setMinutes(req_data.minute);

  console.log(date);

  var type;
  
  if(req_data.type == "signin"){
    type = 1;
  }
  if(req_data.type == "signout"){
    type = 0;
  }

  // Prepare user data for DB insert 
  var values = { class_id: class_id, worker_id: worker_id, time: date, type: type };
  // Update MySQL
  var query = connection.query('UPDATE candb.worker_attendance SET ? WHERE class_id = ? AND worker_id = ? AND type = ?', [values, class_id, worker_id, type], function(err, result) {
  if (err){ 
    console.log('Attendance insert failed!');
    res.json(500, { message: 'Something really went wrong!'});
  }else{
    res.json({"message": "Attendance complete!", "results": result}, 200);
  }});

};

exports.submit_report = function (req, res) {
  var class_id = req.params.id;
  var transporter = nodemailer.createTransport();

  console.log(JSON.stringify(req.body, null, 2));

  var workerAttendance = req.body.workerAttendance.results;
  var workerAttendanceFormatted = workerAttendance.map(function(elem) {
    return {
      firstName: elem.first_name,
      lastName: elem.last_name,
      signIn: elem.attendance && elem.attendance.signin ? elem.attendance.signin["time"] : null,
      signOut: elem.attendance && elem.attendance.signout ? elem.attendance.signout["time"] : null
    };
  });



  json2csv({
    data: workerAttendanceFormatted,
    fields: ["firstName", "lastName", "signIn", "signOut"]
  }, function(err, workerCsv) {

    var particpantAttendance = req.body.participantAttendance.results;
    var particpantAttendanceFormatted = particpantAttendance.map(function (elem) {
      return {
        firstName: elem.first_name,
        lastName: elem.last_name,
        signIn: elem.attendance && elem.attendance.signin ? elem.attendance.signin["time"] : null,
        signOut: elem.attendance && elem.attendance.signout ? elem.attendance.signout["time"] : null
      };
    });


    json2csv({
      data: particpantAttendanceFormatted,
      fields: ["firstName", "lastName", "signIn", "signOut"]
    }, function (err, participantCsv) {
      var classname = "I CAN Basketball";
      var date = "July 26th 2015";

      transporter.sendMail({
        from: 'lkysow@gmail.com',
        to: 'lkysow@gmail.com',
        subject: 'Report for class ' + classname + " on " + date,
        text: 'Report for class ' + classname + " on " + date,
        attachments: [
          {
            filename: "workers.csv",
            content: workerCsv,
            contentType: "text/csv"
          },
          {
            filename: "participants.csv",
            content: participantCsv,
            contentType: "text/csv"
          }
        ]
      }, function (err, info) {
        console.log(err);
        console.log(JSON.stringify(info));
      });
    });
  });


  res.json({"message": "success!"});
};
