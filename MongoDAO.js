// Import necessary MongoDB modules
const MongoClient = require('mongodb').MongoClient
const { ObjectId } = require('mongodb');

// Declare global variables
var coll;

// Connect to MongoDB server and initialize collection
MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2023db')
        coll = db.collection('managers')
    })
    .catch((error) => {
        console.log(error.message)
    })

// Function to list managers
var listManagers = function () {
    return new Promise((resolve, reject) => {
        const query = {};
        const sort = { _id: 1 }
        // Use find, sort, and toArray to retrieve and sort the documents
        coll.find(query).sort(sort).toArray()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

// Function to add a manager
var addManager = function (id, name, salary) {
    return new Promise((resolve, reject) => {
        findQuery = { _id: id }
        // Convert salary to a float
        const formatSalary = parseFloat(salary)
        insertQuery = {
            _id: id, // Convert id to ObjectId
            name: name,
            salary: formatSalary
        };
        // Check if a manager with the given id already exists
        coll.findOne(findQuery)
            .then((existID) => {
                if (existID) {
                    reject(new Error(`Manager ${id} already exists in MongoDB`))
                }
                else {
                    // Insert the manager if it doesn't already exist
                    coll.insertOne(insertQuery)
                        .then((data) => {
                            resolve("Manager Created Successfully")
                        })
                        .catch((error) => {
                            reject(error)
                        })
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Function to check if a manager with a specific id exists
var doesExist = function (value) {
    return new Promise((resolve, reject) => {
        const query = { _id: value };
        console.log("doesExist function" + value);

        // Find a document with the specified id
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

// Export functions for use in other modules
module.exports = { doesExist, listManagers, addManager }
