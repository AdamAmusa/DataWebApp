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
    res.render('edit')


})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
