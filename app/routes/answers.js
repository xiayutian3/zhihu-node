const jwt = require('koa-jwt')  //koa-jwt 路由权限控制
const jsonwebtoken = require('jsonwebtoken') //可以生成token 也可以验证，（不过验证比较简单）其他库的jwt
const Router = require('koa-router')
const { 
  find,findById,create,update,checkAnswerExist,checkAnswerer,delete:del
} = require('../controllers/answers')
const {secret} = require('../config')
const router = new Router({prefix:'/questions/:questionId/answer'})


// koa-jwt认证中间件
const authkoajwt = jwt({secret})


router.get('/',find)

router.post('/',authkoajwt,create)

router.get('/:id',checkAnswerExist,findById)
//put  整体修改   patch 部分修改
router.patch('/:id',authkoajwt,checkAnswerExist,checkAnswerer,update)

router.delete('/:id',authkoajwt,checkAnswerExist,checkAnswerer,del)

// router.get('/:id/followers',checkAnswerExist,listFollowers)


module.exports = router