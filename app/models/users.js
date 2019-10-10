const mongoose = require('mongoose')
const { Schema, model } = mongoose

//用户 模型

const userSchema = new Schema({
  //select 可以隐藏字段
  __v:{type:Number,select:false},
  name:{type:String,required:true},
  password:{type:String,required:true,select:false},
  // age:{type:Number,required:false,default:0}
  avatar_url:{type:String},
  gender:{type:String,enum:['male','female'],default:'male',required:true},
  headline:{type:String},
  locations:{type:[{type:Schema.Types.ObjectId,ref:'Topic'}],select:false},
  business:{type:[{type:Schema.Types.ObjectId,ref:'Topic'}],select:false},
  employments:{type:[{
    company:{type:Schema.Types.ObjectId,ref:'Topic'},
    job:{type:Schema.Types.ObjectId,ref:'Topic'}
  }],select:false},
  educations:{
    type:[{
      school:{type:Schema.Types.ObjectId,ref:'Topic'},
      major:{type:Schema.Types.ObjectId,ref:'Topic'},
      diploma:{type:Number,enum:[1,2,3,4,5,]},
      entrance_year:Number,
      graduation_year:Number
    }],select:false
  },
  following:{
    type:[{type:Schema.Types.ObjectId,ref:'User'}],   //ref 引用类型，与User进行关联
    select:false
  },
  followingTopics:{
    type:[{type:Schema.Types.ObjectId,ref:'Topic'}], 
    select:false
  },
  followingQuestions:{
    type:[{type:Schema.Types.ObjectId,ref:'Question'}], 
    select:false
  },
  likingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}], 
    select:false
  },
  dislikingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}], 
    select:false
  },
  collectingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}], 
    select:false
  },
  likingComments:{
    type:[{type:Schema.Types.ObjectId,ref:'Comment'}], 
    select:false
  }
},{timestamps:true})
module.exports = model('User',userSchema)