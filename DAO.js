var pool;
var mySQL = require('promise-mysql')

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

var getStorebySid = function(sid){
    return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM store WHERE sid = ?`, [sid])
    .then((data) => {
        resolve(data)
    })
    .catch(error => {
        reject(error)
    })
})
}


var editEmployee = function(sid){
    return new Promise((resolve, reject) => {
        pool.query('UPDATE store SET ')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })

}



module.exports = {getStores, getStorebySid};

