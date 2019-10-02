const Topic = require('../models/topics')


//话题接口


class TopicsCtl {

  async find(ctx){
    // ctx.body = await Topic.find()

    // 添加分页
    // 给per_page默认为3
    const {per_page=3}= ctx.query
    const page = Math.max(ctx.query.page*1,1) - 1
    const perPage = Math.max(per_page*1,1);
    ctx.body = await Topic.find().limit(perPage).skip(page*perPage)

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
}
module.exports = new TopicsCtl()