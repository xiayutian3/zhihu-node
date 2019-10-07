const Topic = require('../models/topics')
const User = require('../models/users')
const Question = require('../models/questions')

//话题接口


class TopicsCtl {

  async find(ctx){
    // ctx.body = await Topic.find()

    // 添加分页
    // 给per_page默认为10
    const {per_page=10}= ctx.query
    const page = Math.max(ctx.query.page*1,1) - 1
    const perPage = Math.max(per_page*1,1);
    // ctx.body = await Topic.find().limit(perPage).skip(page*perPage)

    // ctx.body = await Topic.find({name:'上海'})  //精确搜索
    // .limit(perPage).skip(page*perPage)
    ctx.body = await Topic.find({name:new RegExp(ctx.query.q)}) //mongoose提供的语法糖，用正则进行模糊匹配
    .limit(perPage).skip(page*perPage)

  }
  // 检查话题存不存在
  async checkTopicExist(ctx,next){
    const topic = await Topic.findById(ctx.params.id)
    if(!topic){ctx.throw(404,'话题不存在')}
    await next()
  }

  async findById(ctx){
    //如果fields不存在 就默认给他个 ''
    const {fields=''} = ctx.query
    const selectFiels = fields.split(';').filter(f=>f).map(f => ' +'+f).join('')
    const topic = await Topic.findById(ctx.params.id).select(selectFiels) 
    ctx.body = topic
  }
  async create(ctx){
    ctx.verifyParams({
      name:{type:'string',required:false},
      avatar_url:{type:'string',required:false},
      introduction:{type:'string',required:false}
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic;
  }
  async update(ctx){
    ctx.verifyParams({
      name:{type:'string',required:false},
      avatar_url:{type:'string',required:false},
      introduction:{type:'string',required:false}
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    ctx.body = topic
  }
  async listFollowers(ctx){
    const users = await User.find({followingTopics:ctx.params.id})
    ctx.body = users
  }
  async listQuestions(ctx){
    const questions = await Question.find({topics:ctx.params.id})
    ctx.body = questions
  }
}
module.exports = new TopicsCtl()