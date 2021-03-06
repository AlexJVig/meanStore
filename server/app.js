const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ProductRoutes = require('./api/routes/products');
const BranchRoutes = require('./api/routes/branches');
const OrderRoutes = require('./api/routes/orders')
const cors = require('cors');// ********
//const express = require('./api/routes/express');// ***

app.use(cors());
app.options('*', cors());

// app.use(cors({credentials: true, origin: true})); // ***

mongoose.connect("mongodb://localhost:27017/AppProject");

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//app.use((req,res,next) => {
//    res.header('Access-Contral-Allow-Origin','*');
//    res.header('Access-Contral-Allow-Headers','Origin');
//    if (req.method == 'OPTIONS'){
//        res.header('Access-Contral-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
//        return res.status(200).json({});
//    }
//    next();
//});

// app.configure(function () {app.use(allowCrossDomain);}) // ****

// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'example.com');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');

//     next();
// } // *****

app.use('/products',ProductRoutes );
app.use('/branches',BranchRoutes );
app.use('/orders',OrderRoutes );

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`);
        next();
    }

    // const error = new Error('Not Found');
    // error.status(404);
    // next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }
    });
});

module.exports = app;
