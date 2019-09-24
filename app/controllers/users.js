const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const {secret} = require('../config')

class UsersCtl {
  async find(ctx){
    // 加上密码返回  .select('+password')  省略密码 .select('-password')
    // ctx.body = await User.find().select('+password')
    ctx.body = await User.find()
  }
  async findById(ctx){
    const user = await User.findById(ctx.params.id)
    if(!user){
      ctx.throw(404,'用户不存在')
      return
    }
    ctx.body = user
  }
  async create(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      password:{type:'string',required:true}
      // age:{type:'number',required:false}
    })
    const {name} = ctx.request.body
    const repeateUser = await User.findOne({name})
    if(repeateUser){
      ctx.throw(409,'用户名已经存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async updated(ctx){
    ctx.verifyParams({
      //设为false因为可能修改该的是password，或者是name
      name:{type:'string',required:false},
      password:{type:'string',required:false}
      // age:{type:'number',required:false}
    })
    const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    if(!user){
      ctx.throw(404,'用户不存在')
      return
    }
    ctx.body = user
  }
  async deleted(ctx){
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user){
      ctx.throw(404,'用户不存在')
      return
    }
    ctx.status = 204
  }
  async login(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      password:{type:'string',required:true}
    })
    const user = await User.findOne(ctx.request.body)
    if(!user){
      ctx.throw(401,'用户名或密码不正确')
    }
    const {_id,name} = user
    const token = jsonwebtoken.sign({_id,name},secret,{expiresIn:'1d'})
    ctx.body = {
      token
    }
  }
}
module.exports = new UsersCtl()

// 之前的方法
// find(ctx){
//   // a.b
//   ctx.body = db
// }
// findById(ctx){
//   if(ctx.params.id*1 >= db.length){
//     // ctx.throw(412,'先决条件失败')
//     ctx.throw(412)
//   }
//   ctx.body = db[ctx.params.id*1]
// }
// create(ctx){
//   ctx.verifyParams({
//     name:{type:'string',required:true},
//     age:{type:'number',required:false}
//   })
//   db.push(ctx.request.body)
//   ctx.body = ctx.request.body
// }
// updated(ctx){
//   if(ctx.params.id*1 >= db.length){
//     ctx.throw(412)
//   }
//   ctx.verifyParams({
//     name:{type:'string',required:true},
//     age:{type:'number',required:false}
//   })
//   db[ctx.params.id*1] = ctx.request.body
//   ctx.body = ctx.request.body
// }
// deleted(ctx){
//   if(ctx.params.id*1 >= db.length){
//     ctx.throw(412)
//   }
//   ctx.status = 204
//   db.splice(ctx.params.id*1,1)
// }