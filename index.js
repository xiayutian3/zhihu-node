const Koa = require('koa')
const app = new Koa()

app.use(async (ctx,next) => {
  console.log(1)
  await next()     //next() 是一个异步函数
  console.log(2)
  ctx.body = 'hellow zhihu api'
})
app.use(async (ctx,next) => {  //1 3 5 4 2
  console.log(3)  // 
  await next()
  console.log(4)
})
app.use(async (ctx,next) => {
  console.log(5)  // 
})

app.listen(3000)