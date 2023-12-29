var express = require('express')
var app = express()
var port = 3000;
var index = require('./DAO.js')
var mongo = require('./MongoDAO')
const { ObjectId } = require('mongodb');


app.set('view engine', 'ejs');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))




app.get('/', (req, res) => {
    res.render("home");
})


app.get('/stores', (req, res) => {
    index.getStores()
        .then((data) => {
            console.log("OK =========")
            res.render("stores", { "store": data })
        })
        .catch(error => {
            console.log("ERROR ========")
            res.send(error)
        })
})



app.get('/stores/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    index.getStorebySid(sid)
        .then((data) => {
            res.render('edit', { "store": data });
        })
        .catch((error) => {
            res.send(error)
        })


})

app.get('/managers', (req, res) =>{
    
    mongo.listManagers()
    .then((data) =>{
        res.render('managers' , {"manager": data})
    })
    .catch((error) =>{
        
        res.send(error);
    })

})

app.post('/managers/add', (req, res) =>{
    
   const id = req.body.mgrid;
   const name = req.body.name;
   const salary = req.body.salary;

    mongo.addManager(id, name, salary)
    .then((data) =>{
       res.redirect('/managers')
    })
    .catch((error) =>{
        res.status(500).send("Error: " + error.message);
    })

})

app.get('/managers/add', (req, res) =>{
    res.render('addManager')
})


app.get('/products', (req, res) =>{

    index.getProducts()
    .then((data) =>{
        res.render( 'products', {"product": data})
    })
    .catch((error) => {
        res.send(error)
    })

})




app.get('/products/delete/:pid', (req, res) => {

    const pid = req.params.pid;
     console.log(pid);
    index.deleteEmployee(pid)
    .then((data) =>{
        res.redirect('/products')
    })
    .catch((error) =>{
        res.status(500).send(`<h1>Error Message:</h1> <br> <h1>${error.message}</h1> <br> <a href="/">Home</a>`);
        
    })
    
    
})

app.post('/stores/edit/:sid', (req, res) => {
    console.log(req.body.sid);
    console.log(req.body.mgrid);
    console.log(req.body.location);

    const sid = req.body.sid;
    const mgrid = req.body.mgrid;
    const location = req.body.location



            console.log("Is Managing statement");
            index.editEmployee(sid, mgrid, location)
                .then((data) => {
               
                    res.redirect('/stores')
                })
                .catch((error) => {
                    res.send(mgrid + " is managing another store")
                })
       




})


app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
