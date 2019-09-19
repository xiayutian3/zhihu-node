const db = [{name:'李磊',age:45}]

class UsersCtl {
  find(ctx){
    // a.b
    ctx.body = db
  }
  findById(ctx){
    if(ctx.params.id*1 >= db.length){
      // ctx.throw(412,'先决条件失败')
      ctx.throw(412)
    }
    ctx.body = db[ctx.params.id*1]
  }
  create(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      age:{type:'number',required:false}
    })
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }
  updated(ctx){
    if(ctx.params.id*1 >= db.length){
      ctx.throw(412)
    }
    ctx.verifyParams({
      name:{type:'string',required:true},
      age:{type:'number',required:false}
    })
    db[ctx.params.id*1] = ctx.request.body
    ctx.body = ctx.request.body
  }
  deleted(ctx){
    if(ctx.params.id*1 >= db.length){
      ctx.throw(412)
    }
    ctx.status = 204
    db.splice(ctx.params.id*1,1)
  }
}
module.exports = new UsersCtl()