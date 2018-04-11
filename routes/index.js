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

/* Getting users password data */
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

/* Adding new password data */
router.post('/insert', function (req, res) {
    var item = {
        website: req.body.website,
        username: req.body.username,
        password: req.body.password
    };

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);// to check if we have an error
        db.db('masterpass').collection('passwords').insertOne(item, function(err, result) {
            assert.equal(null, err)  ;
            console.log('Item inserted');
            db.close();
        });
        req.flash('success_msg', 'Item updated');
    });
});

/* Updating password data */
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

/* Deleting password data */
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
