const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    port = process.env.PORT || 8080,
    router = require('./router'),
    config = dotenv.config()

let uri = "mongodb+srv://node-user:<password>@osrs-price-predictor-1m7h8.gcp.mongodb.net/test?retryWrites=true";

if(config.error) {
    throw config.error
}

uri = uri.replace("<password>",config.mongoose_password)
mongoose.Promise = global.Promise;
mongoose.connect(uri,  { useNewUrlParser: true })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', router);

app.listen(port, console.log("Running OSRS Price Predictor on " + port));
