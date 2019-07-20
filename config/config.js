require('dotenv').config();
module.exports = {
    getDbConnectionUsers: function () {
        return process.env.MONGO_USERS_URI;
    },
    getDbConnectionProducts: function () {
        return process.env.MONGO_PRODUCT_URI;
    }
};
