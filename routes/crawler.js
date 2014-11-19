/**
 * Implements Crawler logic
 */

var http = require("http");
var fs = require('fs');

var options = {
  host: "189.3.136.24",
  port: 80,
  path: "http://www.hardmob.com.br/promocoes/",
  method: 'GET'
};

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'promocrawler1@gmail.com',
        pass: 'teste1234'
    }
});

var mongoose = require('mongoose');
var Keyword = require('../models/Keyword.js');
mongoose.connect('mongodb://localhost/promocrawler');

module.exports = function(app,cheerio) {
		
		
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
			fs.readFile('/home/neoway/Documentos/teste_node/Promocoes.html', function (err, data) {
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
						
						var User = mongoose.model('User', { name: String, email: String });
		
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
}


