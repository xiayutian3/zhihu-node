const User = require('../models/users')

class UsersCtl {
  async find(ctx){
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
      age:{type:'number',required:false}
    })
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async updated(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      age:{type:'number',required:false}
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