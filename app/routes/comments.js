const jwt = require('koa-jwt')  //koa-jwt 路由权限控制
const jsonwebtoken = require('jsonwebtoken') //可以生成token 也可以验证，（不过验证比较简单）其他库的jwt
const Router = require('koa-router')
const { 
  find,findById,create,update,checkCommentExist,checkCommentator,delete:del
} = require('../controllers/comments')
const {secret} = require('../config')
const router = new Router({prefix:'/questions/:questionId/answer/:answerId/comments'})


// koa-jwt认证中间件
const authkoajwt = jwt({secret})


router.get('/',find)

router.post('/',authkoajwt,create)

router.get('/:id',checkCommentExist,findById)
//put  整体修改   patch 部分修改
router.patch('/:id',authkoajwt,checkCommentExist,checkCommentator,update)

router.delete('/:id',authkoajwt,checkCommentExist,checkCommentator,del)

// router.get('/:id/followers',checkCommentExist,listFollowers)


module.exports = router