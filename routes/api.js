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
  var worker_id = req.session.worker_id;
  // First get all the sessions to which the current worker has been assigned
  var sql = 'SELECT session.id as session_id, name as session_name, start_date as session_start_date, end_date as session_end_date, venue as session_venue FROM candb.session INNER JOIN candb.worker_registration ON session.id = worker_registration.session_id WHERE worker_registration.worker_id = ' + worker_id + ' ORDER BY session_id;';
  var query = connection.query(sql, function(err, result) {   
    if (err) { 
      console.log(err);
      res.json({"message": "Something went wrong!", "results": null}, 500); 
    } else {
      if (result.length === 0) {
        res.json({"message": "No sessions or classes", "results": null}, 404); 
      } else {
        var session_ids = result.map(function(value) {
          return value.session_id;
        });
        console.log('just session ids: ' + JSON.stringify(session_ids));
        console.log(result);
        // Manually stitch the classes for those sessions because we do not want duplicate session information
        sql = 'SELECT class.id AS class_id, class.date as class_date, class.session_id FROM candb.session INNER JOIN candb.class ON class.session_id = session.id WHERE session.id IN (' + session_ids.join(',') + ');';
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

// TODO: refactor class_worker_registrations and class_participant_registrations functions into closure

exports.class_worker_registrations = function(req, res){

  var classid = req.params.classid;
  console.log('classid: ' + classid);

  if(!classid){
    res.json({ "message": "classid cannot be empty!", "status": "error"}, 404);
  }

  // This SQL query returns all the workers who are registered for a particular class
  var sql = 'select session.name, class.id as class_id, class.session_id, worker_registration.worker_id, worker.first_name, worker.last_name, worker.email_address, worker.type from (candb.worker_registration inner join (candb.class inner join candb.session on class.session_id = session.id) on worker_registration.session_id = class.session_id) inner join candb.worker on worker_registration.worker_id = worker.id where class.id = ' + classid +' ORDER BY worker.last_name;'
  var query = connection.query(sql, function(err, result) {   
    if (err) {
      console.log(err);
      res.json({"message": "Something went wrong!", "results": null}, 500);
    } else {
      if (result.length === 0) {
        res.json({"message": "No registrations found", "results": null}, 404);
      } else {
        console.log(result);
        // This SQL query returns all the workers who have signed in and signed out
        sql = 'select worker_attendance.worker_id, worker_attendance.time, worker_attendance.type from candb.worker_attendance where worker_attendance.class_id = ' + classid + ' ORDER BY worker_id;';
        var query2 = connection.query(sql, function(err, result2) {
          // We manually stitch the two results together because the two existing SQL queries are complicated enough
          result.forEach(function (currentValue) {
            var attendanceRecords = result2.filter(function matchingWorkers(filterValue) {
              return filterValue.worker_id == currentValue.worker_id;
            });

            currentValue.attendance = {};
            attendanceRecords.forEach(function(record) {
              if (record.type == 0) {
                currentValue.attendance.signout = record;
              } else {
                currentValue.attendance.signin = record;
              }
            });
          });
          // Return to view
          res.json({"message": "Successfully gathered registrations and attendance", "results": result}, 200);
        });
      }
    }
  });
};

exports.class_participant_registrations = function(req, res){

  var classid = req.params.classid;
  console.log('classid: ' + classid);

  if(!classid){
    res.json({ "message": "classid cannot be empty!", "status": "error"}, 404);
  }

  // This SQL query returns all the participants who are registered for a particular class
  var sql = 'select session.name, class.id as class_id, class.session_id, participant_registration.participant_id, participant.first_name, participant.last_name, participant.email_address from (candb.participant_registration inner join (candb.class inner join candb.session on class.session_id = session.id) on participant_registration.session_id = class.session_id) inner join candb.participant on participant_registration.participant_id = participant.id where class.id = ' + classid +' ORDER BY participant.last_name;'
  var query = connection.query(sql, function(err, result) {   
    if (err) {
      console.log(err);
      res.json({"message": "Something went wrong!", "results": null}, 500); 
    } else {
      if (result.length === 0) {
        res.json({"message": "No registrations found", "results": null}, 404); 
      } else {
        console.log(result);
        // This SQL query returns all the participants who have signed in and signed out
        sql = 'select participant_attendance.participant_id, participant_attendance.time, participant_attendance.type from candb.participant_attendance where participant_attendance.class_id = ' + classid + ' ORDER BY participant_id;';
        var query2 = connection.query(sql, function(err, result2) {
          // We manually stitch the two results together because the two existing SQL queries are complicated enough
          result.forEach(function (currentValue) {
            var attendanceRecords = result2.filter(function matchingParticipants(filterValue) {
              return filterValue.participant_id == currentValue.participant_id;
            });

            currentValue.attendance = {};
            attendanceRecords.forEach(function(record) {
              if (record.type == 0) {
                currentValue.attendance.signout = record;
              } else {
                currentValue.attendance.signin = record;
              }
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
