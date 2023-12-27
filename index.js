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
