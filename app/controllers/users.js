const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const {secret} = require('../config')

//用户登录，注册。鉴权，授权等

class UsersCtl {
  async find(ctx){
    // 加上密码,age返回 中间要有空格隔开  .select('+password')  .select('+password +age')  省略密码 .select('-password')
    // ctx.body = await User.find().select('+password')
    // ctx.body = await User.find()

    // 添加分页
    // 给per_page默认为10
    const {per_page=10}= ctx.query
    const page = Math.max(ctx.query.page*1,1) - 1
    const perPage = Math.max(per_page*1,1);
    // ctx.body = await User.find().limit(perPage).skip(page*perPage)

    //模糊搜索
    ctx.body = await User.find({name:new RegExp(ctx.query.q)}).limit(perPage).skip(page*perPage)

  }
  async findById(ctx){
     //如果fields不存在 就默认给他个 ''
    const {fields=''} = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f=>' +'+f).join('')
    // console.log(fields.split(';')) //   [ 'locations', 'business' ]
    // console.log(selectFields)  //   ‘ +locations +business’

    //返回中就多了两个字段locations，employments  中间要有空格隔开 第一个前边有空格也没关系
    // const user = await User.findById(ctx.params.id).select('+locations +employments')

    const populateStr = fields.split(';').filter(f => f).map(f=> {
      if(f === "employments"){
        return 'employments.company employments.job'
      }
      if(f === 'educations'){
        return 'educations.school educations.major'
      }
      return f
    }).join(' ')
    
    const user = await User.findById(ctx.params.id).select(selectFields)
    .populate(populateStr)
      // .populate('following locations business employments.company employments.job educations.school educations.major')
    if(!user){
      ctx.throw(404,'用户不存在')
      return
    }
    ctx.body = user
  }
  async create(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      password:{type:'string',required:true}
      // age:{type:'number',required:false}
    })
    const {name} = ctx.request.body
    const repeateUser = await User.findOne({name})
    if(repeateUser){
      ctx.throw(409,'用户名已经存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async updated(ctx){
    ctx.verifyParams({
      //设为false因为可能修改该的是password，或者是name
      name:{type:'string',required:false},
      password:{type:'string',required:false},
      // age:{type:'number',required:false}
      avatar_url:{type:'string',required:false},
      gender:{type:'string',required:false},
      headline:{type:'string',required:false},
      locations:{type:'array',itemType:'string',required:false},
      business:{type:'array',required:false},
      employments:{type:'array',itemType:'object',required:false},
      educations:{type:'array',itemType:'object',required:false}
    })
    const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    if(!user){
      ctx.throw(404,'用户不存在')
      return
    }
    ctx.body = user
  }
  async deleted(ctx){
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user){
      ctx.throw(404,'用户不存在')
      return
    }
    ctx.status = 204
  }
  async login(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      password:{type:'string',required:true}
    })
    const user = await User.findOne(ctx.request.body)
    if(!user){
      ctx.throw(401,'用户名或密码不正确')
    }
    const {_id,name} = user
    const token = jsonwebtoken.sign({_id,name},secret,{expiresIn:'1d'})
    ctx.body = {
      token
    }
  }
  async listFollowing(ctx){   //关注的人的列表
    const user = await User.findById(ctx.params.id).select('+following').populate('following')  //不仅能获取到id，还能获取用户其他信息，不加populate，那就只有id了
    if(!user) {ctx.throw(404,'用户不存在')}
    ctx.body = user.following;
  }
  //获取粉丝列表
  async listFollowers(ctx){
    const users = await User.find({following:ctx.params.id})
    ctx.body = users
  }
  //判断用户是否存在的中间件
  async checkUserExist(ctx,next){
    const user = await User.findById(ctx.params.id)
    if(!user){ctx.throw(404,'用户不存在')}
    await next()
  }
  async follow(ctx){
    const me = await User.findById(ctx.state.user._id).select('+following')
    // mongoose自带的id不是字符串，需转换，
    if(!me.following.map(id => id.toString()).includes(ctx.params.id)){ 
      me.following.push(ctx.params.id)
      await me.save() //保存在数据库中
    }
    ctx.status = 204;  //代表成功并没有内容返回
  }
  async unfollow(ctx){
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if(index >-1){
      me.following.splice(index,1)
      await me.save()
    }
    ctx.status = 204
  }

  async listFollowingTopic(ctx){   //关注的话题列表
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')  //不仅能获取到id，还能获取用户其他信息，不加populate，那就只有id了
    if(!user) {ctx.throw(404,'用户不存在')}
    ctx.body = user.followingTopics;
  }
  async followTopic(ctx){
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    // mongoose自带的id不是字符串，需转换，
    if(!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)){ 
      me.followingTopics.push(ctx.params.id)
      await me.save() //保存在数据库中
    }
    ctx.status = 204;  //代表成功并没有内容返回
  }
  async unfollowTopic(ctx){
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if(index >-1){
      me.followingTopics.splice(index,1)
      await me.save()
    }
    ctx.status = 204
  }

  async listQuestions(ctx){
    const questions = await Question.find({questioner:ctx.params.id})
    ctx.body = questions
  }

  //取消和关注问题
  async followQuestion(ctx){
    const mine = await User.findById(ctx.state.user._id).select('+followingQuestions')
    if(!mine.followingQuestions.map(id => id.toString()).includes(ctx.params.id)){
      mine.followingQuestions.push(ctx.params.id)
      await mine.save()
    }
    ctx.status = 204
  }
  async unfollowQuestion(ctx){
    const mine = await User.findById(ctx.state.user._id).select('+followingQuestions')
    const index = mine.followingQuestions.map(id => id.toString()).indexOf(ctx.params.id)
    if(index>-1){
      mine.followingQuestions.splice(index,1)
      await mine.save()
    }
    ctx.status = 204
  }

  async listFollowingQuestion(ctx){
    const mine = await User.findById(ctx.params.id).select('+followingQuestions').populate('followingQuestions')
    if(!mine) {ctx.throw(404,'用户不存在')}
    ctx.body = mine.followingQuestions
  }


  //点赞过的答案列表 (赞的列表)
  async listLikingAnswers(ctx){  
    const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers') 
    if(!user) {ctx.throw(404,'用户不存在')}
    ctx.body = user.likingAnswers;
  }
  //喜欢答案（给答案点赞）
  async likeAnswer(ctx,next){
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    if(!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)){ 
      me.likingAnswers.push(ctx.params.id)
      await me.save() 
      //更新答案模型投票数 (每次自动增加 1 )
      await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
    }
    ctx.status = 204;
    await next()
  }
  //不喜欢答案 （取消赞）
  async unlikeAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index >-1){
      me.likingAnswers.splice(index,1)
      await me.save()
      //更新答案模型投票数 (每次自动减少 1 )
      await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:-1}})
    }
    ctx.status = 204
  }




    //踩过的答案列表 (踩的列表)
    async listdisLikingAnswers(ctx){  
      const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers') 
      if(!user) {ctx.throw(404,'用户不存在')}
      ctx.body = user.dislikingAnswers;
    }
    //踩答案
    async dislikeAnswer(ctx,next){
      const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
      if(!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)){ 
        me.dislikingAnswers.push(ctx.params.id)
        await me.save()
      }
      ctx.status = 204;
      await next()
    }
    //取消踩答案
    async undislikeAnswer(ctx){
      const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
      const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
      if(index >-1){
        me.dislikingAnswers.splice(index,1)
        await me.save()
      }
      ctx.status = 204
    }



    //收藏的答案列表 (收藏答案的列表)
    async listcollectingAnswers(ctx){  
      const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers') 
      if(!user) {ctx.throw(404,'用户不存在')}
      ctx.body = user.collectingAnswers;
    }
    //收藏答案
    async collectAnswer(ctx,next){
      const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
      if(!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)){ 
        me.collectingAnswers.push(ctx.params.id)
        await me.save()
      }
      ctx.status = 204;
      await next()
    }
    //取消收藏答案
    async uncollectAnswer(ctx){
      const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
      const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
      if(index >-1){
        me.collectingAnswers.splice(index,1)
        await me.save()
      }
      ctx.status = 204
    }


}
module.exports = new UsersCtl()

// 之前的方法
// find(ctx){
//   // a.b
//   ctx.body = db
// }
// findById(ctx){
//   if(ctx.params.id*1 >= db.length){
//     // ctx.throw(412,'先决条件失败')
//     ctx.throw(412)
//   }
//   ctx.body = db[ctx.params.id*1]
// }
// create(ctx){
//   ctx.verifyParams({
//     name:{type:'string',required:true},
//     age:{type:'number',required:false}
//   })
//   db.push(ctx.request.body)
//   ctx.body = ctx.request.body
// }
// updated(ctx){
//   if(ctx.params.id*1 >= db.length){
//     ctx.throw(412)
//   }
//   ctx.verifyParams({
//     name:{type:'string',required:true},
//     age:{type:'number',required:false}
//   })
//   db[ctx.params.id*1] = ctx.request.body
//   ctx.body = ctx.request.body
// }
// deleted(ctx){
//   if(ctx.params.id*1 >= db.length){
//     ctx.throw(412)
//   }
//   ctx.status = 204
//   db.splice(ctx.params.id*1,1)
// }