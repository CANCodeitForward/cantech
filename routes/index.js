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

exports.index = function(req, res){
    res.render('dashboard');
};

exports.login = function(req, res){ 
    res.render("login");
};

exports.login_user = function(req, res){

    var email = sanitizer.sanitize(req.body.email);
    var password = sanitizer.sanitize(req.body.password);

    if(!email){
        res.json({ "message": "Email cannot be empty!", "status": "error"}, 500);
    }
    if(!password){
        res.json({ "message": "Password cannot be empty!", "status": "error"}, 500);
    }

    // Create mysql query 
    var sql = 'SELECT * FROM candb.user WHERE email = ' + connection.escape(email) + ' AND password = ' + connection.escape(password); 
    // Get user id if it is a valid user
    var query = connection.query(sql, function(err, result) {   
        if (err){ 
            console.log(err);
            res.json({"message": "Something went wrong!", valid: false}); 
        }else{
         if (result.length === 0) {
            res.json({"message": "User doesn't exists!", valid: false}); 
         } else {
            // Set user id
            var user_id = result[0].id;
            // Worker id in Session
            req.session.worker_id = result[0].worker_id;
            // Save User ID in Session
            req.session.user_id = user_id;
            // Save User Email in Session 
            req.session.email = email;
            // Return to view
            res.json({"message": "Successfully logged in!", valid: true}, 200);
            }
        }
    });
};

exports.sessions = function(req, res){

    req.session.email = "anubhavmishra@live.com";
    req.session.worker_id = "2";

    if(!req.session.email){
        res.redirect('/');
    }else{

        var worker_id = req.session.worker_id;
        // Create mysql query 
        var sql = 'SELECT session.id as session_id, name as session_name, start_date as session_start_date, end_date as session_end_date, venue as session_venue, class.id as class_id, class.date as class_date FROM candb.session INNER JOIN candb.session_worker ON session.id=session_worker.session_id INNER JOIN candb.class ON session.id=class.session_id WHERE session_worker.worker_id=' + worker_id + ' ORDER BY session_id;';
        var query = connection.query(sql, function(err, result) {   
        if (err){ 
            console.log(err);
            res.json({"message": "Something went wrong!", "results": null}, 500); 
        }else{
         if (result.length === 0) {
            res.json({"message": "No sessions or classes", "results": null}, 404); 
         } else {
            console.log(result);
            // Return to view
            res.json({"message": "Successfully gathered sessions and associated classes", "results": result}, 200);
            }
        }
    });

    }
};



// Request JSON data: { "type": "signin/signout", "timestamp": "2015-07-26 15:39:06" }
// curl -H "Content-Type: application/json" -X POST -d '{ "type": "signin", "timestamp": "2015-07-26 15:39:06" }' http://localhost:3000/class/1/attendance_participant/1
exports.class_participant_attendance = function(req, res){

    var class_id = req.params.id;
    var participant_id = req.params.participant_id;
    var req_data = req.body;

    var timestamp = req_data.timestamp;
    var type;

    if(req_data.type == "signin"){
        type = 1;
    }
    if(req_data.type == "signout"){
        type = 0;
    }

    // Prepare user data for DB insert 
    var values = { class_id: class_id, participant_id: participant_id, time: timestamp, type: type };
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
// curl -H "Content-Type: application/json" -X POST -d '{ "type": "signin", "timestamp": "2015-07-26 15:39:06" }' http://localhost:3000/class/1/attendance_worker/1
exports.class_worker_attendance = function(req, res){

    var class_id = req.params.id;
    var worker_id = req.params.worker_id;
    var req_data = req.body;

    var timestamp = req_data.timestamp;
    var type;
    
    if(req_data.type == "signin"){
        type = 1;
    }
    if(req_data.type == "signout"){
        type = 0;
    }

    // Prepare user data for DB insert 
    var values = { class_id: class_id, worker_id: worker_id, time: timestamp, type: type };
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
// curl -H "Content-Type: application/json" -X PATCH -d '{ "type": "signin", "timestamp": "2015-07-26 15:39:06" }' http://localhost:3000/class/1/attendance_participant/1
exports.class_participant_attendance_update = function(req, res){

    var class_id = req.params.id;
    var participant_id = req.params.participant_id;
    var req_data = req.body;

    var timestamp = req_data.timestamp;
    var type;

    if(req_data.type == "signin"){
        type = 1;
    }
    if(req_data.type == "signout"){
        type = 0;
    }

    // Prepare user data for DB insert 
    var values = { class_id: class_id, participant_id: participant_id, time: timestamp, type: type };
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
// curl -H "Content-Type: application/json" -X PATCH -d '{ "type": "signin", "timestamp": "2015-07-26 15:39:06" }' http://localhost:3000/class/1/attendance_worker/1
exports.class_worker_attendance_update = function(req, res){

    var class_id = req.params.id;
    var worker_id = req.params.worker_id;
    var req_data = req.body;

    var timestamp = req_data.timestamp;
    var type;
    
    if(req_data.type == "signin"){
        type = 1;
    }
    if(req_data.type == "signout"){
        type = 0;
    }

    // Prepare user data for DB insert 
    var values = { class_id: class_id, worker_id: worker_id, time: timestamp, type: type };
    // Update MySQL
    var query = connection.query('UPDATE candb.worker_attendance SET ? WHERE class_id = ? AND worker_id = ? AND type = ?', [values, class_id, worker_id, type], function(err, result) {
    if (err){ 
        console.log('Attendance insert failed!');
        res.json(500, { message: 'Something really went wrong!'});
    }else{
        res.json({"message": "Attendance complete!", "results": result}, 200);
    }});

};





