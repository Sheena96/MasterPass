var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/masterpass';


/* GET home page.*/
router.get('/', ensureAuthenticated, function(req, res) {
  res.render('index', { title: 'MasterPass Web App' });
});


function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
      return next();

    }else {
      //req.flash('error_msg', 'You are not logged in');
      res.redirect('/users/login');
    }
}

/* Getting users social media password data */
router.get('/get-data', function (req, res) {
    var resultArray = [];
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        var cursor = db.db('masterpass').collection('passwords').find();
        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            db.close();
            res.render('index', {items: resultArray});
        });
    });
});

/* Adding new social media password data */
router.post('/insert', function (req, res) {

    var item = {
        website: req.body.website,
        username: req.body.username,
        password: req.body.password
    };

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);// to check if we have an error
        db.db('masterpass').collection('passwords').insertOne(item, function(err, result) {

            /*// Nodejs encryption with CTR to encrypt passwords entered by the user
            var crypto = require('crypto'),
                algorithm = 'aes-256-ctr',
                password = 'd6F3Efeq';

            function encrypt(text){
                var cipher = crypto.createCipher(algorithm,password);
                var crypted = cipher.update(text,'utf8','hex');
                crypted += cipher.final('hex');
                return crypted;
            }

            function decrypt(item){
                var decipher = crypto.createDecipher(algorithm,password);
                var dec = decipher.update(text,'hex','utf8');
                dec += decipher.final('utf8');
                return dec;
            }

            var item = encrypt(item);
            // outputs hello world
            console.log(decrypt(item));*/

            assert.equal(null, err);
            console.log('Item inserted');
            db.close();
        });
        req.flash('success_msg', 'Item updated');
    });
});

/* Updating social media password data */
router.post('/update', function (req, res, next) {
    var item = {
        website: req.body.website,
        username: req.body.username,
        password: req.body.password
    };

    var id = req.body.id;

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);// to check if we have an error
        db.db('masterpass').collection('passwords').updateOne({"_id": objectId(id)}, {$set:item}, function(err, result) {
            assert.equal(null, err)  ;
            console.log('Item updated');
            db.close();
        });
    });
});

/* Deleting social media password data */
router.post('/delete', function (req, res, next) {

    var id = req.body.id;

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);// to check if we have an error
        db.db('masterpass').collection('passwords').deleteOne({"_id": objectId(id)}, function(err, result) {
            assert.equal(null, err)  ;
            console.log('Item deleted');
            db.close();
        });
    });
});

module.exports = router;
