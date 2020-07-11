const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    refreshToken: {type: String, required: true}
});

module.exports = mongoose.model("Refreshtoken",refreshTokenSchema,"refreshtoken");
