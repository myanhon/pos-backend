require('dotenv').config();
module.exports = {
    getDbConnection: function () {
        return process.env.MONGO_POS_URI;
    }
};
