const db = [{name:'李磊',age:45}]

class UsersCtl {
  find(ctx){
    ctx.body = db
  }
  findById(ctx){
    ctx.body = db[ctx.params.id*1]
  }
  create(ctx){
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }
  updated(ctx){
    db[ctx.params.id*1] = ctx.request.body
    ctx.body = ctx.request.body
  }
  deleted(ctx){
    ctx.status = 204
    db.splice(ctx.params.id*1,1)
  }
}
module.exports = new UsersCtl()