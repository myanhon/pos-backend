const mongoose = require('mongoose');
module.exports = {
    getDbConnection: function () {
        let mongooseUrl = process.env.MONGO_POS_URI || process.env.MONGO_DB_ATLAS;
        console.log('current url: ', mongooseUrl);
        mongoose.connect(mongooseUrl, {
            useNewUrlParser: true, useUnifiedTopology: true
        }).then(() => {
                console.log('mongo connected');
            }
        ).catch(error => {
            console.log("mongo not connected error:", error);
        });
    }
};