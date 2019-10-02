var MongoClient = require('mongodb').MongoClient, assert = require('assert');

module.exports = {

    getAll: function(coll) {
        console.log('mongo getAll');
        var pro = (MongoClient.connect('mongodb://localhost:27017/csci467')
                .then(obj => db = obj)
                .then(obj => db.collection(coll).find({}, {'limit':20, 'sort':[['timeStamp','desc']]}).toArray()))
                .then(docs => {
                    // console.log('found ' + docs.length);
                    db.close();
                    return docs;
                });
        return pro;
    },
    
    doInsert: function (coll, obj) {
        // Connection URL
        var url = 'mongodb://localhost:27017/csci467';
        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server");
            // Insert a single document
            db.collection(coll).insertOne(obj, function (err, r) {
                assert.equal(null, err);
                assert.equal(1, r.insertedCount);
                console.log("object inserted");
                db.close();
            });
        });
    },

    insertMaybe: function (coll, key, data) {
        var pro = (MongoClient.connect('mongodb://localhost:27017/csci467')
                .then(obj => db = obj)
                .then(obj => db.collection(coll).findOne(key))
                .then(docs => {
                    if (docs !== null) {
                        for (i in data) data[i] = docs[i];
                        data.errors = ["transaction already exists"];
                        console.log("transaction already exists");                       
                        db.close();
                    } else {
                        // console.log("not found: " + JSON.stringify(key));
                        data.timeStamp = Date.now();
                        // insert record
                        db.collection(coll).insertOne(data).then( result => {
                            assert.equal(1, result.insertedCount);
                            console.log("record inserted");
                            db.close();
                        }).catch((err) => console.log(err));
                    }
                    ;
                }).catch((err) => console.log(err)));
        return pro;
    }
};