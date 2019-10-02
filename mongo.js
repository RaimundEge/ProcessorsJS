const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'csci467';

module.exports = {
    getAll: function(coll) {
        var pro = (MongoClient.connect(url, { useNewUrlParser: true })
                .then(client => {
                    db = client.db(dbName);
                    return db.collection(coll).find({}, {'limit':20, 'sort':[['timeStamp','desc']]}).toArray()})
                .then(docs => {                   
                    return docs;
                }));
        return pro;
    },
    
    doInsert: function (coll, obj) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            assert.equal(null, err);
            var db = client.db(dbName);
            console.log('connected to database');
            // Insert a single document
            db.collection(coll).insertOne(obj, function (err, r) {
                assert.equal(null, err);
                assert.equal(1, r.insertedCount);
                console.log("object inserted");
                client.close();
            });
        });
    },

    insertMaybe: function (coll, key, data) {
        var pro = MongoClient.connect(url, { useNewUrlParser: true })
            .then(client => {
                db = client.db(dbName);
                console.log('connected to database');
                console.log('looking for: ' + JSON.stringify(key));
                return db.collection(coll).findOne(key, function(err, result) {
                    assert.equal(null, err);
                    if (result !== null) {
                        console.log("transaction already exists"); 
                        for (i in data) data[i] = result[i];
                        data.errors = ["transaction already exists"];   
                    } else {
                        console.log("not found: " + JSON.stringify(key));
                        data.timeStamp = Date.now();
                        console.log("inserting record: " + JSON.stringify(data));
                        db.collection(coll).insertOne(data, function(err, result) {
                            assert.equal(null, err);
                            console.log('done: ' + result.insertedCount + ' record inserted');
                            assert.equal(1, result.insertedCount); 
                        })
                    }
                    client.close();
                })            
            });
        return pro;
    }
}