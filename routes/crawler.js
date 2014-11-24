/**
 * Crawler Logic
 */
var http = require("http");
var options = {
		host: "189.3.136.24",
		port: 80,
		path: "http://www.hardmob.com.br/promocoes",
		method: 'GET'
};
var mongoose = require('mongoose');
var Keyword = require('./../models/Keyword.js');
var Promotion = require('./../models/Promotion.js');
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


function findPromo(title, callback){

	var stream = Promotion.find({title:title}).stream();
	callback(stream, data);
}

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
					    to: user.email, // list of receivers
					    subject: 'Promocao encontrada: ' + title,
					    html: title
					};
				        console.log('enviando email para :' +user.email);
					transporter.sendMail(mailOptions, function(error, info){
					    if(error){
					    	console.log(error);
					    }else{
					    	console.log('Message sent: ' + info.response);
					    }
					});
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

setInterval(function(){
	console.log('verificando promocoes do hardmob as:' + new Date());
	download(options, function downloadResult(data) {
	  if (data) {
		  findKeywordsAndusers(data, parseHtml);
	  }
	  else console.log("error");  
	});
},  1 * 60 * 1000);