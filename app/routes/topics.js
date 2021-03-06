const jwt = require('koa-jwt')  //koa-jwt 路由权限控制
const jsonwebtoken = require('jsonwebtoken') //可以生成token 也可以验证，（不过验证比较简单）其他库的jwt
const Router = require('koa-router')
const { 
  find,findById,create,update,listFollowers,checkTopicExist,listQuestions
} = require('../controllers/topics')
const {secret} = require('../config')
const router = new Router({prefix:'/topics'})


// koa-jwt认证中间件
const authkoajwt = jwt({secret})


router.get('/',find)

router.post('/',authkoajwt,create)

router.get('/:id',checkTopicExist,findById)
//put  整体修改   patch 部分修改
router.patch('/:id',authkoajwt,checkTopicExist,update)

router.get('/:id/followers',checkTopicExist,listFollowers)

router.get('/:id/questions',checkTopicExist,listQuestions)


module.exports = router