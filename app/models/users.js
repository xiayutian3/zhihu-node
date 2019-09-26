const mongoose = require('mongoose')
const { Schema, model } = mongoose
const userSchema = new Schema({
  //select 可以隐藏字段
  __v:{type:Number,select:false},
  name:{type:String,required:true},
  password:{type:String,required:true,select:false},
  // age:{type:Number,required:false,default:0}
  avatar_url:{type:String},
  gender:{type:String,enum:['male','female'],default:'male',required:true},
  headline:{type:String},
  locations:{type:[{type:String}]},
  business:{type:String},
  employments:{type:[{
    company:{type:String},
    job:{type:String}
  }]},
  educations:{
    type:[{
      school:String,
      major:String,
      diploma:{type:String,enum:[1,2,3,4,5,]},
      entrance_year:Number,
      graduation_year:Number
    }]
  }
})
module.exports = model('User',userSchema)