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
            const query = { _id: value };
            console.log("doesExist function" + value);
    
            coll.findOne(query)
                .then((document) => {
                    if (document) {
                        // If a document is found, resolve with the document
                        resolve(document);
                    } else {
                        // If no document is found, reject with an error
                        reject();
                    }
                })
                .catch((error) => {
                    // Handle other errors
                    reject(error);
                });
        });
    };
    
    
    

module.exports = {doesExist}