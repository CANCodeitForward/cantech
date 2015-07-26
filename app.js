/**
 *
 **/
 
var express = require('express');
var routes = require('./routes/index');
var api = require('./routes/api');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require("fs");
var app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.compress());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: "123123a", cookie: {maxAge: 86400000}
}));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

function authUser(req, res, next) {
  if (req.session.worker_id) {
    return next();
  } else {
    return next(new Error('Failed login'));
  }
}

app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node examples/error-pages
if ('production' == app.get('env')) {
  app.disable('verbose errors');
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// Index Page
app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login_user', routes.login_user);
app.get('/api/sessions', authUser, api.sessions);
app.get('/api/class/:classid/worker_registration', authUser, api.class_worker_registrations);
app.get('/api/class/:classid/participant_registration', authUser, api.class_participant_registrations);
app.post('/api/class/:id/attendance_participant/:participant_id', authUser, api.class_participant_attendance);
app.post('/api/class/:id/attendance_worker/:worker_id', authUser, api.class_worker_attendance);
app.patch('/api/class/:id/attendance_participant/:participant_id', authUser, api.class_participant_attendance_update);
app.patch('/api/class/:id/attendance_worker/:worker_id', authUser, api.class_worker_attendance_update);

// Create server
http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + 3000 + ' in ' + app.get('env') + ' mode');
}); 
 
