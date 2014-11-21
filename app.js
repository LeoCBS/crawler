var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');


var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONK_URL);
var port = process.env.PORT || 8080;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

require('./routes/keyword.js')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});





/**
 * Crawler Logic
 */
var http = require("http");
var options = {
		host: "189.3.136.24",
		port: 80,
		path: "http://www.hardmob.com.br/promocoes/",
		method: 'GET'
};
var mongoose = require('mongoose');
var Keyword = require('./models/Keyword.js');
var User = mongoose.model('User', { name: String, email: String });
mongoose.connect(process.env.MONGODB_URL);
var fs = require('fs');
var cheerio = require("cheerio");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
  http.get(options, function(res) {
    var data = "";
	res.pipe(process.stdout);  
  res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  }
);
}

function loadHTML(){
	fs.readFile(process.env.FILE_PATH_CRAWLER, function (err, data) {
	  if (err) {
	    throw err; 
	  }
		findKeywordsAndusers(data, parseHtml);
	});
}


setInterval(function(){
	console.log('verificando promocoes do hardmob as:' + new Date());
	download(options, function(data) {
	  if (data) {
	    parseHtml(data);
	  }
	  else console.log("error");  
	});
},  1 * 60 * 1000);

function saveTitlePromo(data){
    // Set our collection
    var collection = db.get('promotions');
    
    // Submit to the DB
    collection.insert({
        "title" : data
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("Ocorreu algum erro ao inserir no banco de dados. Cod: " + err);
        } else {
	   console.log('persistindo:' + data)
	}
    });
}

function parseHtml(stream,data){
	var $ = cheerio.load(data);

	$("li").each(function(i, e) {
    	    var title = $(e).find("h3>a").text();
            if(title.trim()){
		stream.on('data',function (keyword) {
			if(title.toUpperCase().indexOf(keyword.keyword.toUpperCase()) > -1){
				console.log('tem promocao com a keyword:' + keyword.keyword);
				console.log(title);
				
				User.find({}).stream().on('data', function (user) {
					var mailOptions = {
					    from: 'Promo Crawler <promocrawler1@gmail.com>', // sender address
					    to: 'leocborgess@gmail.com', // list of receivers
					    subject: 'Promocao encontrada',
					    html: title
					};
				        console.log('enviando email para :' +user.email);
					/*transporter.sendMail(mailOptions, function(error, info){
					    if(error){
						console.log(error);
					    }else{
						console.log('Message sent: ' + info.response);
					    }
					});*/
				});
			}
		});
	     }
    	});
}

function findKeywordsAndusers(data, callback){

	var stream = Keyword.find({}).stream();
	callback(stream, data);
}

//loadHTML();

app.listen(port);
console.log("App listening on port " + port);

//application -------------------------------------------------------------
app.get('*', function(req, res) {
	res.sendfile('./views/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = app;
