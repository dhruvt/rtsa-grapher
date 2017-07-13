var express = require('express');
var path = require('path');
var open = require('open');
var logger = require('./logger');


var port = 8080;
var app = express();
var log = logger().getLogger('grapher');

app.use(express.static('./'))

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(port,function(err){
	if(err){
		log.error(err)
	}
})
