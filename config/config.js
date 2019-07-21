require('dotenv').config();
module.exports = {
    getDbConnectionUsers: function () {
        return process.env.MONGO_POS_URI;
    }
};
