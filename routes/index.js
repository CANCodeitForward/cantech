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