const mongoose = require('mongoose')
const {Schema,model} = mongoose
const User = require('./users')

//评论  模型


const commentSchema = new Schema({
  __v:{type:Number,select:false},
  content:{type:String,required:true},
  description:{type:String},
  commentator:{type:Schema.Types.ObjectId,ref:'User',required:true,select:false},
  questionId:{type:String,required:true}, //问题id
  answerId:{type:String,required:true}, //回答。答案id
  rootCommentId:{type:String}, //根评论，一级评论
  replyTo:{type:Schema.Types.ObjectId,ref:"User"}  //回复给哪个用户
},{timestamps:true}) //mongoose自带时间撮信息

module.exports = model('Comment',commentSchema)