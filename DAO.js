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
        // Assign the created pool to the global variable
        pool = p
    })
    .catch(e => {
        // Handle errors if the pool creation fails
        console.log("pool error:" + e)
    })


//gets all store data from database
var getStores = function () {
    return new Promise((resolve, reject) => {
        //select all stores
        pool.query('SELECT * FROM store')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

//function that prints store data from sid
var getStorebySid = function (sid) {
    return new Promise((resolve, reject) => {
        //select everythin from table with a specific store id
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

//function that loads all products from database
var getProducts = function () {
    return new Promise((resolve, reject) => {
        //to show all products including products not associated with any stores
        pool.query(`SELECT product.pid, product.productdesc, product_store.sid, store.location, product_store.price AS price FROM product LEFT JOIN product_store ON product.pid = product_store.pid LEFT JOIN store ON product_store.sid = store.sid`)
            .then((data) => {
                resolve(data);

            })
            //SQL Error
            .catch((error) => {
                reject(error);

            })

    })



}


//function for editing employee
var editEmployee = function (sid, mgrid, location) {
    return new Promise((resolve, reject) => {
        //The query checks the database to collect store data that will include manager ids
        pool.query(`SELECT * FROM store WHERE sid = ?`, [sid])
            // console.log("In edit employee")
            .then((data) => {
                const currLocation = data[0].location;
                const currMgrid = data[0].mgrid;

                // Check if manager ID exists in MongoDB
                mongoDAO.doesExist(mgrid)
                    .then((exists) => {

                        console.log("Document exists in MongoDB: " + exists);

                        //delete if theres any changes in data
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
                // SQL errors
                reject(mysqlError);
            });
    });
};


//function to delete product by pid
var deleteEmployee = function(pid){
    return new Promise((resolve, reject) => {
        //to show all products including products not associated with any stores before deletion
        pool.query(`DELETE product FROM product LEFT JOIN product_store ON product.pid = product_store.pid LEFT JOIN store ON product_store.sid = store.sid WHERE product.pid = ? AND store.sid IS NULL`, [pid])
        .then((result) =>{
            //checks the affected rows to check if any changes where made
                const rows = result.affectedRows; //https://stackoverflow.com/questions/34227458/update-in-mysql-from-node-js-how-to-tell-if-zero-rows-are-effected
                if (rows > 0) {
                    resolve(`Successfully deleted product with pid of ${pid}`);
                } else {
                    //if no rows are effected that means the product is already in stores
                    reject(new Error(`${pid} is currently in stores and cannot be deleted`));
                }
        })
        .catch((error) =>{
            //database related errors
            reject(error);
        })

    })


}




module.exports = { getStores, getStorebySid, editEmployee, getProducts, deleteEmployee};

