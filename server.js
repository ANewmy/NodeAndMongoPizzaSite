var express = require('express');
var app = express();
var path = require('path');
//var userAuth = require('./user_controller/userVerify.js');
var orderFS = require('./db_controller/dbOrders.js');
var menuFS = require('./db_controller/dbMenu.js');

const { ObjectId } = require('mongodb');
//var router = express.Router();

//router-> step1: require userVerify.js

var publicPath = path.resolve(__dirname, 'static');
app.use(express.static(publicPath));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var session = require('express-session');
var sess = {
    secret: 'keyboard cat',
    cookie: {},
};

app.use(session(sess));

var MongoClient = require('mongodb').MongoClient;
var db, menu;

var args = process.argv.slice(2);

if (args == 'dev') {
    var dbURL = 'mongodb://pizza1:pizza1@localhost:27017/pizza';
    MongoClient.connect(dbURL, function(err, database) {
        if (err) throw err;

        db = database.db('pizza');

        // Start the application after the database connection is ready
        app.listen(8000);
        console.log('Listening on port 8000');
    });
} else {
    const PORT = process.env.PORT || 8000;
    var dbURL = 'mongodb://pizza1:pizza1@ds111430.mlab.com:11430/heroku_cfj3kqdj';
    MongoClient.connect(dbURL, function(err, database) {
        if (err) throw err;

        db = database.db('heroku_cfj3kqdj');

        // Start the application after the database connection is ready
        app.listen(PORT);
        console.log('Listening on port 8000');
    });
}

app.get('/', function(req, res) {
    res.sendFile(`${publicPath}/index.html`);
});

app.get('/adminLogin', function(req, res) {
    res.sendFile(`${publicPath}/adminLogin.html`);
    /* body... */
});

app.get('/menu', function(req, res) {
    var query = {};
    findMenuItems(res, query);
});

app.get('/menus', function(req, res) {
    if (req.session.user) {
        res.sendFile(`${publicPath}/adminMenus.html`);
    } else {
        res.sendFile(`${publicPath}/adminLogin.html`);
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/adminLogin');
    });

    /* body... */
});
//demo orders.html, only valid user can access orders.html
app.get('/orders', function(req, res) {
    console.log('res: ', res);
    if (req.session.user) res.sendFile(`${publicPath}/orders.html`);
    else res.sendFile(`${publicPath}/adminLogin.html`);

    /* body... */
});
//demo destroy session when get /logout

app.get('/showOrders', function(req, res) {
    var query = {};
    findOrderItems(res, query);
});

app.post('/updateMenu', function(req, res) {
    var data = req.body;
    var query = { _id: ObjectId(data._id) };
    var update = {
        $set: { pizzaName: data.pizzaName, description: data.description, price: data.price, imgName: data.imgName },
    };
    menuFS.updateMenu(res, query, update);
});

//router step2: use the router, userAuth
var userAuth = require('./user_controller/userVerify.js');
app.use('/adminLogin', userAuth);
// app.post("/login",function (req,res) {
//    body...
//  console.log('login with post')
// })

function findMenuItems(res, query) {
    console.log(query);
    db
        .collection('menu')
        .find(query)
        .toArray(function(err, results) {
            console.log(results);

            res.json(results);
        });
}

function findOrderItems(res, query) {
    db
        .collection('orders')
        .find(query)
        .toArray(function(err, results) {
            console.log('server.findOrderItems.res', results);

            res.writeHead(200);
            res.end(JSON.stringify(results));
        });
}

//two functions to export db and publicPath

var getDb = function() {
    return db;
};

var getPublicPath = function() {
    return publicPath;
};

module.exports.getDb = getDb;
module.exports.getPublicPath = getPublicPath;
