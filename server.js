#!/usr/bin/nodejs

// -------------- load packages -------------- //
var express = require('express');
var app = express();
var path = require('path');

// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 3000);

// -------------- express endpoints -------------- //
app.get('/', function(req, res){
    res.send('peep');
});

// -------------- listener -------------- //
var listener = app.listen(app.get('port'), function(){
    console.log('Express server started on port: ' + listener.address().port);
});
