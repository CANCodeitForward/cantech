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
    res.send("HEY!");
};

exports.login = function(req, res){ 
    res.render("login");
};

exports.dashboard = function(req, res) {
    res.render('dashboard');
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
        var sql = 'SELECT session.id as session_id, name as session_name, start_date as session_start_date, end_date as session_end_date, venue as session_venue, class.id as class_id, class.date as class_date FROM candb.session INNER JOIN candb.session_worker ON session.id=session_worker.session_id INNER JOIN candb.class ON session.id=class.session_id WHERE session_worker.worker_id=' + worker_id + ' ORDER BY session_id;' 
        // Get user id if it is a valid user
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

exports.class_attendance = function(req, res){

    var worker_id = req.session.worker_id;
    var class_id = req.params.id;
    var participant = req.params.participant_id;

    var req_data = req.body.data;
    

};
