const mongoose = require('mongoose')
const {Schema,model} = mongoose
const User = require('./users')
const Topic = require('./topics')

//问题  模型（一个用户可以对应多个问题，一个问题只能有一个提问者）


const questionSchema = new Schema({
  __v:{type:Number,select:false},
  title:{type:String,required:true},
  description:{type:String},
  //实现一对多的精髓（一个用户对用多个用户）
  questioner:{type:Schema.Types.ObjectId,ref:'User',required:true,select:false},
  //话题与问题（多对多关系）
  topics:{
    type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    select:false
  }
})

module.exports = model('Question',questionSchema)