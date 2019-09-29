const Koa = require('koa')
 
//支持json form  文件 传输
const koabody = require('koa-body')
//只支持json form 格式 
// const bodyparser = require('koa-bodyparser')
const path = require('path')
//设置静态资源中间件
const koaStatic = require('koa-static')
const error = require('koa-json-error')  //错误处理
const parameter = require('koa-parameter') //参数校验
const mongoose = require('mongoose')
const routing = require('./routes')
const {connectionStr} = require('./config')
const app = new Koa()

mongoose.set('useFindAndModify', false)
mongoose.connect(connectionStr,{ useNewUrlParser: true ,useUnifiedTopology: true}, () => console.log('mongodb 连接成功'))
mongoose.connection.on('error', console.error)

//自己编写的错误处理中间件
// app.use(async (ctx,next) => {
//   try{
//     await next();
//   }catch(err){
//     ctx.status = err.status || err.statusCode || 500
//     ctx.body = {
//       message: err.message
//     }
//   }
// })

app.use(koaStatic(path.join(__dirname,'public')))

app.use(error({
  postFormat:(e,{stack,...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))

// app.use(bodyparser())
app.use(koabody({
  multipart:true, //启用支持文件
  formidable:{   //node 一个npm包，用法跟她本身一样， koabody引用了这个包
    uploadDir:path.join(__dirname,'/public/uploads'),      //指定上传目录
    keepExtensions:true              //保留拓展名（默认为false）
  }
}))
app.use(parameter(app))
routing(app)









// app.use(router.routes(), router.allowedMethods())  // ***2019/9/15**** 写在里边 options方法不起作用
// app.use(usersRouter.routes(), usersRouter.allowedMethods())  //写在里边 options方法不起作用


// app.use(router.routes()).use(router.allowedMethods())  //在外边options方法才起作用 
// app.use(usersRouter.routes()).use(router.allowedMethods())

app.listen(3000,() => console.log('服务启动成功'))

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


