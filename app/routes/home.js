const Router = require('koa-router')
const router = new Router()
const {index} = require('../controllers/home')
// const homeCtl = require('../controllers/home')
// router.get('/',async (homeCtl.index))

router.get('/',  index)


module.exports = router