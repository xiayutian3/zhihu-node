const jwt = require('koa-jwt')  //koa-jwt 路由权限控制
const jsonwebtoken = require('jsonwebtoken') //可以生成token 也可以验证，（不过验证比较简单）其他库的jwt
const Router = require('koa-router')
const { 
  find,findById,create,updated,deleted,login,
  listFollowing,listFollowers,checkUserExist,follow,unfollow,followTopic,unfollowTopic,
  listFollowingTopic,listQuestions,followQuestion,unfollowQuestion,listFollowingQuestion,
  listLikingAnswers,likeAnswer,unlikeAnswer,listdisLikingAnswers,dislikeAnswer,undislikeAnswer,
  listcollectingAnswers,collectAnswer,uncollectAnswer
} = require('../controllers/users')
const {checkTopicExist} = require('../controllers/topics')
const {checkQuestionExist} = require('../controllers/questions')
const {checkAnswerExist} = require('../controllers/answers')
const {secret} = require('../config')
const router = new Router({prefix:'/users'})


// koa-jwt认证中间件
const authkoajwt = jwt({secret})



//自己编写的认证中间件
const auth = async (ctx,next) => {
  // Bearer+空格+token 的形式  
  // ctx.request.header 把里边的字段变成小写了 authorization
  const {authorization = ''} = ctx.request.header
  const token = authorization.replace('Bearer ','')
  
  try{
    //有可能报错 抛出500
    const user = jsonwebtoken.verify(token,secret)
    ctx.state.user = user
  }catch(err){
    ctx.throw(401,err.message)
  }
  await next()
}

//自己编写的授权中间件
const checkOwner = async (ctx,next) =>{
  if(ctx.params.id !== ctx.state.user._id){
    ctx.throw(403,'没有权限这么做')
  }
  await next()
}





router.get('/',find)

router.post('/',create)

router.get('/:id',findById)
//put  整体修改   patch 部分修改
router.patch('/:id',authkoajwt,checkOwner,updated)

router.delete('/:id',authkoajwt,checkOwner,deleted)

router.post('/login',login)
//关注的人列表
router.get('/:id/following',listFollowing)
//获取粉丝列表
router.get('/:id/followers',listFollowers)
//关注 某人
router.put('/following/:id',authkoajwt,checkUserExist,follow)
//取消关注 某人
router.delete('/following/:id',authkoajwt,checkUserExist,unfollow)
//获取某个人的关注话题列表
router.get('/:id/followingTopics',listFollowingTopic)
//关注 话题
router.put('/followTopics/:id',authkoajwt,checkTopicExist,followTopic)
//取消关注 话题
router.delete('/unfollowTopics/:id',authkoajwt,checkTopicExist,unfollowTopic)

//用户的提问的问题列表
router.get('/:id/questions',listQuestions)


//获取某个人关注的问题列表
router.get('/:id/followQuestions',listFollowingQuestion)
//关注问题
router.put('/followQuestions/:id',authkoajwt,checkQuestionExist,followQuestion)
//取消关注 问题
router.delete('/unfollowQuestions/:id',authkoajwt,checkQuestionExist,unfollowQuestion)


// 赞答案相关
router.get('/:id/likingAnswers',listLikingAnswers)  //赞过答案的列表
router.put('/likingAnswers/:id',authkoajwt,checkAnswerExist,likeAnswer,undislikeAnswer)   //点赞答案 (赞踩的互斥关系，点赞的时候再执行，取消踩。点踩的时候再执行消赞)
router.delete('/likingAnswers/:id',authkoajwt,checkAnswerExist,unlikeAnswer) //取消点赞答案

// 踩答案相关
router.get('/:id/dislikingAnswers',listdisLikingAnswers)  //踩过答案的列表
router.put('/dislikingAnswers/:id',authkoajwt,checkAnswerExist,dislikeAnswer,unlikeAnswer)   //踩答案 (赞踩的互斥关系，点赞的时候再执行，取消踩。点踩的时候再执行消赞)
router.delete('/dislikingAnswers/:id',authkoajwt,checkAnswerExist,undislikeAnswer) //取消踩答案

//收藏答案相关
router.get('/:id/collectingAnswers',listcollectingAnswers)  //收藏答案列表
router.put('/collectingAnswers/:id',authkoajwt,checkAnswerExist,collectAnswer)  // 收藏答案
router.delete('/collectingAnswers/:id',authkoajwt,checkAnswerExist,uncollectAnswer)  //取消收藏答案


module.exports = router




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