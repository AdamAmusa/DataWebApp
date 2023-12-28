var pool;
var mySQL = require('promise-mysql')
var mongoDAO = require('./MongoDAO')


mySQL.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2023'
})
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("pool error:" + e)
    })



var getStores = function () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM store')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

var getStorebySid = function (sid) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM store WHERE sid = ?`, [sid])
            .then((data) => {
                console.log(data);
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}


var getProducts = function () {

    return new Promise((resolve, reject) => {
        pool.query(`SELECT product.pid, product.productdesc, product_store.sid, store.location, product_store.price AS price FROM product LEFT JOIN product_store ON product.pid = product_store.pid LEFT JOIN store ON product_store.sid = store.sid`)
            .then((data) => {
                resolve(data);

            })
            .catch((error) => {
                reject(error);

            })

    })



}



var editEmployee = function (sid, mgrid, location) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM store WHERE sid = ?`, [sid])
            // console.log("In edit employee")
            .then((data) => {
                const currLocation = data[0].location;
                const currMgrid = data[0].mgrid;

                // Check if manager ID exists in MongoDB
                mongoDAO.doesExist(mgrid)
                    .then((exists) => {

                        console.log("Document exists in MongoDB: " + exists);

                        if (location !== currLocation || mgrid !== currMgrid) {

                            // Update MySQL record
                            pool.query('UPDATE store SET location = ?, mgrid = ? WHERE sid = ?', [location, mgrid, sid])

                                .then((updateResult) => {
                                    resolve('Record updated successfully');
                                })
                                .catch((error) => {

                                    reject(mgrid + "is managing another store");
                                });
                        } else {
                            // Values are the same, resolve without updating
                            resolve('No changes');
                        }
                    })
                    .catch((mongoError) => {
                        // Manager ID doesn't exist in MongoDB
                        reject('Manager ID does not exist in MongoDB');
                    });
            })
            .catch((mysqlError) => {
                // Error querying MySQL database
                reject('Error querying MySQL database: ' + mysqlError);
            });
    });
};




module.exports = { getStores, getStorebySid, editEmployee, getProducts};

