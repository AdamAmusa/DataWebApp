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
        console.log(data);
        resolve(data)
    })
    .catch(error => {
        reject(error)
    })
})
}


var editEmployee = function(sid, mgrid, location) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM store WHERE sid = ?`, [sid])
            .then((data) => {
                const currLocation = data[0].location;
                const currMgrid = data[0].mgrid

                if(location !== currLocation || mgrid !==currMgrid ){
                    pool.query('UPDATE store SET location = ?, mgrid = ? WHERE sid = ?', [location, mgrid, sid])
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject(error);
                    });

            } else {
                // Values are the same, resolve without updating
                resolve('No changes');
             }
                
            })
            .catch((error) => {
                reject(error);
            });
    });
};




module.exports = {getStores, getStorebySid, editEmployee};

