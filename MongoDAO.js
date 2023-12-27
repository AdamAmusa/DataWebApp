const MongoClient = require('mongodb').MongoClient
const { ObjectId } = require('mongodb');
var coll;

MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2023db')
        coll = db.collection('managers')
    })
    .catch((error) => {
        console.log(error.message)
    })


   

    var doesExist = function (value) {
        return new Promise((resolve, reject) => {
            const query = { _id: new ObjectId(value) };
    
            coll.findOne(query, (error, document) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(document !== null);
                }
            });
        });
    };
    

module.exports = {doesExist}