const Router = require('koa-router')
const { find,findById,create,updated,deleted } = require('../controllers/users')
const router = new Router({prefix:'/users'})


router.get('/',find)

router.post('/',create)

router.get('/:id',findById)

router.put('/:id',updated)

router.delete('/:id',deleted)








// router.get('/',async(ctx) => {
//   // ctx.set('Allow','GET, POST')
//   ctx.body = db
// })

// router.post('/',async(ctx) => {
//   db.push(ctx.request.body)
//   ctx.body = ctx.request.body
// })

// router.get('/:id',async(ctx) => {
//   // ctx.body = {name:'aa',age:12}
//   ctx.body = db[ctx.params.id*1]
// })

// router.put('/:id',async(ctx) => {
//   // ctx.body = {name:'aa2',age:12}
//   db[ctx.params.id*1] = ctx.request.body
//   ctx.body = ctx.request.body
// })

// router.delete('/:id',async(ctx) => {
//   ctx.status = 204
//   db.splice(ctx.params.id*1,1)
// })

module.exports = router