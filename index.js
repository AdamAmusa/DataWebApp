var express = require('express')
var app = express()
var port = 3000;
var index = require('./DAO.js')

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



app.get('/stores/edit/:sid', (req, res) =>{
     const sid = req.params.sid;
    index.getStorebySid(sid)

    .then((data) => {
        res.render('edit', {"store": data });
    })
    .catch((error) =>{
        res.send(error)
    })


})


app.post('/stores/edit/:sid', (req, res)=>{

    index.editEmployee()
    .then((data) =>{
        res.send(data)
    })
    .catch((error) =>{
        res.send(error)
    })
})


app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
