const mongoose = require('mongoose');
const connectDB = async () => {

    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect('mongodb+srv://ajtheinventor23:X3MCvLxffzq2BfIO@cluster0.7p0uwlp.mongodb.net/blog');
        console.log(`Database Connected: ${conn.connection.host}`);
    }catch (error){
        console.log(error);
    }
}
module.exports = connectDB;