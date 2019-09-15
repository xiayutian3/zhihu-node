const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const usersRouter = new Router({prefix:'/users'})

//4-5
router.get('/',async(ctx) => {
  ctx.body = '这是主页'
})

usersRouter.get('/',async(ctx) => {
  ctx.body = [
    {name:'aa',age:12},
    {name:'bb',age:18}
  ]
})

usersRouter.post('/',async(ctx) => {
  ctx.body = {name:'aa',age:12}
})

usersRouter.get('/:id',async(ctx) => {
  ctx.body = {name:'aa',age:12}
})

usersRouter.put('/:id',async(ctx) => {
  ctx.body = {name:'aa2',age:12}
})

usersRouter.delete('/:id',async(ctx) => {
  ctx.status = 204
})




// app.use(router.routes(), router.allowedMethods())  // ***2019/9/15**** 写在里边 options方法不起作用
// app.use(usersRouter.routes(), usersRouter.allowedMethods())  //写在里边 options方法不起作用

app.use(router.routes()).use(router.allowedMethods())  //在外边options方法才起作用 
app.use(usersRouter.routes()).use(router.allowedMethods())

app.listen(3000)

//4-4的内容
//自定义中间件
// const auth = async (ctx,next) => {
//   if(ctx.url !== '/users'){
//     ctx.throw(401)
//   }
//   await next()
// }

// router.get('/',async(ctx) => {
//   ctx.body = '这是主页'
// })

// usersRouter.get('/',auth,async(ctx) => {
//   ctx.body = '这是用户列表'
// })

// usersRouter.post('/',auth,async(ctx) => {
//   ctx.body = '这是创建用户接口'
// })

// usersRouter.get('/:id',auth,async(ctx) => {
//   ctx.body = `这是用户 ${ctx.params.id}`
// })









//4-2的内容
// app.use(async (ctx,next) => {
//   // await next()     //next() 是一个异步函数

//   if(ctx.url === '/'){
//     ctx.body = '这是主页'
//   }else if(ctx.url === '/users'){
//     if(ctx.method === "GET"){
//       ctx.body = '这是用户列表页'
//     }else if(ctx.method === 'POST'){
//       ctx.body = '创建用户'
//     }else{
//       ctx.status = 405
//     }
//   }else if(ctx.url.match(/\/users\/\w+/)){
//     const userId = ctx.url.match(/\/users\/(\w+)/)[1]
//     ctx.body = `用户id ${userId}`
//   }else{
//     ctx.status = 404
//   }
// })


