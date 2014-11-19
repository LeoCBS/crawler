var express = require('express');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
*/

/* GET index. */
router.get('/crawler', function(req, res) {
    res.render('crawler', { title: 'crawler para busca de promoções' })
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET keywords list page. */
router.get('/keywordslist', function(req, res) {
    var db = req.db;
    var collection = db.get('keywords');
    collection.find({},{},function(e,docs){
        res.render('keywordslist', {
            "keywordslist" : docs
        });
    });
});

/* GET keywords list page for angular. */
router.get('/rest/keywordslistjson', function(req, res) {
    var db = req.db;
    var collection = db.get('keywords');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/* GET New promo parttern. */
router.get('/newpromo', function(req, res) {
    res.render('newpromo', { title: 'Adicione um novo padrão de busca' });
});

/* GET New user. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Novo usuário' });
});

/* POST add new user for crawler */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    var name = req.body.name;
    var email = req.body.email;

    // Set our collection
    var collection = db.get('users');

    // Submit to the DB
    collection.insert({
        "name" : name,
        "email" : email
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("Ocorreu algum erro ao inserir no banco de dados. Cod: " + err);
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("users");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

/* POST add new keyword for crawler */
router.post('/addpromo', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var keyword = req.body.keyword;

    // Set our collection
    var collection = db.get('keywords');

    // Submit to the DB
    collection.insert({
        "keyword" : keyword
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("Ocorreu algum erro ao inserir no banco de dados. Cod: " + err);
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("keyword");
            // And forward to success page
            res.redirect("keywordslist");
        }
    });
});

module.exports = router;
