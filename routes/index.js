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

    // Get query from request
    var url_parts = url.parse(req.url, true);
    // Get request parameters
    var email = sanitizer.sanitize(url_parts.query.email);
    var password = sanitizer.sanitize(url_parts.query.password);

    if(!email){
        res.json({ "message": "Email cannot be empty!", "status": "error"}, 500);
    }
    if(!password){
        res.json({ "message": "Password cannot be empty!", "status": "error"}, 500);
    }

    req.session.email = email;

    res.redirect('/dashboard');
};