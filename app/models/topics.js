const mongoose = require('mongoose')
const {Schema,model} = mongoose

//话题  模型


const topicSchema = new Schema({
  __v:{type:Number,select:false},
  name:{type:String,required:true},
  avatar_url:{type:String},
  introduction:{type:String,select:false}
},{timestamps:true})

module.exports = model('Topic',topicSchema)