/*
 * GET home page.
 */

var url = require('url');
var path = require('path');
var request = require('request');
var mysql = require('mysql');
var sanitizer = require('sanitizer');
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');

// MySQL Config
/**var connection = mysql.createConnection({
    host     : config.MYSQL_HOST,
    user     : config.MYSQL_USER,
    password : config.MYSQL_PASSWORD
});**/

exports.index = function(req, res){ 
    res.send("HEY!");
};

exports.login = function(req, res){ 
    res.render("login");
};

exports.login_user = function(req, res){

    var email = sanitizer.sanitize(req.body.email);
    console.log('email: ' + email);
    var password = sanitizer.sanitize(req.body.password);
    console.log('password: ' + password);

    if(!email){
        res.json({ "message": "Email cannot be empty!", "status": "error"}, 500);
    }
    if(!password){
        res.json({ "message": "Password cannot be empty!", "status": "error"}, 500);
    }

    // TODO: Authenticate with database

    req.session.email = email;

    res.redirect('/dashboard');
};