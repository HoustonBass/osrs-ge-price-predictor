const mongoose = require('mongoose');
const dotenv = require('dotenv')
let uri = "mongodb+srv://node-user:<password>@osrs-price-predictor-1m7h8.gcp.mongodb.net/test?retryWrites=true";

const config = dotenv.config()

if(config.error) {
    throw config.error
}

uri = uri.replace("<password>",config.mongoose_password)

mongoose.connect(uri) 
