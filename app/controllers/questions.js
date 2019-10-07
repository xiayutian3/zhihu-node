const Question = require('../models/questions')
const User = require('../models/users')


//问题接口


class QuestionsCtl {

  async find(ctx){
    // ctx.body = await Question.find()

    // 添加分页
    // 给per_page默认为10
    const {per_page=10}= ctx.query
    const page = Math.max(ctx.query.page*1,1) - 1
    const perPage = Math.max(per_page*1,1);
    // ctx.body = await Question.find().limit(perPage).skip(page*perPage)

    // ctx.body = await Question.find({name:'上海'})  //精确搜索
    // .limit(perPage).skip(page*perPage)

    const q = new RegExp(ctx.query.q)
    ctx.body = await Question.find({$or:[{title:q},{description:q}]}) //mongoose提供的语法糖，用正则进行模糊匹配
    .limit(perPage).skip(page*perPage)

  }
  // 检查问题存不存在
  async checkQuestionExist(ctx,next){
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if(!question){ctx.throw(404,'问题不存在')}

    //绑定到state上，进行共用
    ctx.state.question = question
    await next()
  }

  async findById(ctx){
    //如果fields不存在 就默认给他个 ''
    const {fields=''} = ctx.query
    const selectFiels = fields.split(';').filter(f=>f).map(f => ' +'+f).join('')
    const question = await Question.findById(ctx.params.id).select(selectFiels).populate('questioner topics')
    ctx.body = question
  }
  async create(ctx){
    ctx.verifyParams({
      title:{type:'string',required:false},
      description:{type:'string',required:false}
    })
    const question = await new Question({ ...ctx.request.body,questioner:ctx.state.user._id}).save()
    ctx.body = question;
  }

  async checkQuestioner(ctx,next){
    const {question} = ctx.state
    //questioner是引用类型objectId，所以要转换字符串
    if(question.questioner.toString() !== ctx.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }

  async update(ctx){
    ctx.verifyParams({
      title:{type:'string',required:false},
      description:{type:'string',required:false}
    })
    // const question = await Question.findByIdAndUpdate(ctx.params.id,ctx.request.body)
   await ctx.state.question.updateOne(ctx.request.body)

    ctx.body = ctx.state.question
  }
  async delete(ctx){
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}
module.exports = new QuestionsCtl()