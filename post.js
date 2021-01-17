const mongoose=require('mongoose');


const PostSchema = new mongoose.Schema({
    name:String,
    title:String,
    content:String,
    likes:{default:0, type:Number},
});

module.exports = mongoose.model('post', PostSchema);