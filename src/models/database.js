// Importing required modules
require('dotenv').config()
const mongoose = require('mongoose');
const crypto = require("crypto");
mongoose.set('strictQuery', true);
const mongoDbUri = process.env.MONGO_DB_URI;

console.log(mongoDbUri);
// Connecting to the MongoDB Atlas database

mongoose.connect(mongoDbUri, { useNewUrlParser: true });
const db = mongoose.connection;
// Logging any errors that occur when connecting to the database.
db.on('error', (error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});
// Logging a success message once the connection is established.
db.once('open', () => {
    console.log('Successfully connected to MongoDB Atlas.');
});

// Enumerating budget categories
enumCategory=[
    'food',
    'housing',
    'health',
    'sport',
    'education',
    'transportation',
    'other',]

// Creating a schema for users
const usersSchema= new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            default: () => {
                return crypto.randomUUID();
            },
        },
        username: String,
        password:String,
    },
    {versionKey: false}
);

// Creating a schema for budget entries
const budgetSchema= new mongoose.Schema({
        user_id:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            enum:enumCategory,
            required:true,
        },
        sum:{
            type:Number,
            required:true,
        },
    id:{
        type:String,
        unique:true,
        default:()=>{
            return crypto.randomUUID();
        },
    }},
    {versionKey: false}
);

// Creating User and Budget models using the defined schemas
const User=mongoose.model('User',usersSchema);
const Budget=mongoose.model('Budget',budgetSchema);

module.exports={User,Budget};