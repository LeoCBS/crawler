var Keyword = require('../models/Keyword.js');


function findAll(res){
	Keyword.find(function(err, keywords) {
	      if(!err) {
	        return res.send(keywords);
	      } else {
	        res.statusCode = 500;
	        console.log('Internal error(%d): %s',res.statusCode,err.message);
	        return res.send({ error: 'Server error' });
	      }
	    });
	
}

module.exports = function(app) {


  /**
   * Find and retrieves all keywords
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllKeywords = function(req, res) {
    console.log("GET - /keyword/list");
    return Keyword.find(function(err, keywords) {
      if(!err) {
        return res.send(keywords);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Create new keyword
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  addkeyword = function(req, res) {
   	console.log("GET - /keyword/add");
    
	var keyword = new Keyword({
		keyword: req.body.keyword,
	});
	keyword.save(function(err) {
	if(err) {
		console.log('Error while saving keyword: ' + err);
		res.send({ error:err });
		return;
	} else {
		return findAll(res);
	}
	});
  };

  deleteKeyword = function(req, res) {
		console.log("DELETE - /keyword/del/" + req.params.id_keyword);

		var keyword = new Keyword({
			_id: req.params.id_keyword,
		});
		keyword.remove(function(err, data) {
			if(!err) {
				return findAll(res);
		      } else {
		        res.statusCode = 500;
		        console.log('Internal error(%d): %s',res.statusCode,err.message);
		        return res.send({ error: 'Server error' });
		      }
		});
	};


  //Link routes and actions
  app.get('/keyword/list', findAllKeywords);
  app.delete('/keyword/del/:id_keyword', deleteKeyword);
  //app.get('/tshirt/:id', findById);
  app.post('/keyword/add', addkeyword);
  //app.put('/tshirt/:id', updateTshirt);

}
