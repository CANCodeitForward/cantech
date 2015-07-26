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

// MySQL Config
var connection = mysql.createConnection({
    host     : config.MYSQL_HOST,
    user     : config.MYSQL_USER,
    password : config.MYSQL_PASSWORD
});


exports.class_registrations = function(req, res){

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
            currentValue.attendance = result2.filter(function matchingParticipants(filterValue) {
             return filterValue.participant_id == currentValue.participant_id;
            });
          });
          // Return to view
          res.json({"message": "Successfully gathered registrations and attendance", "results": result}, 200);
        });
      }
    }
  });
};
