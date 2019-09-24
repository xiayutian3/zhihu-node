const mongoose = require('mongoose')
const { Schema, model } = mongoose
const userSchema = new Schema({
  //select 可以隐藏字段
  __v:{type:Number,select:false},
  name:{type:String,required:true},
  password:{type:String,required:true,select:false}
  // age:{type:Number,required:false,default:0}
})
module.exports = model('User',userSchema)