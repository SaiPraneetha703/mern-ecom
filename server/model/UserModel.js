const mongoose = require('mongoose'); // Import mongoose
const ecomDbConnection = mongoose.connection.useDb('Ecomdb');

const userSchema = new mongoose.Schema({
name: { type: String, required: true },
phone:{ type: String, required: true, unique: true },
password: { type: String, required: true },
}); 

const UserModel = ecomDbConnection.model('User', userSchema); // Create a model from the schema
module.exports = UserModel;