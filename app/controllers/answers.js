const Answer = require('../models/answers')


//问题答案 接口


class AnswersCtl {

  async find(ctx){
    const {per_page=10}= ctx.query
    const page = Math.max(ctx.query.page*1,1) - 1
    const perPage = Math.max(per_page*1,1);

    const q = new RegExp(ctx.query.q)
    // ctx.body = await Answer.find({$or:[{content:q},{description:q}]}) //mongoose提供的语法糖，用正则进行模糊匹配
    ctx.body = await Answer.find({content:q,questionId:ctx.params.questionId}) //精准匹配
    .limit(perPage).skip(page*perPage)

  }
  async checkAnswerExist(ctx,next){
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if(!answer){ctx.throw(404,'答案不存在')}
    //只有路由中存在questionId，才执行（只有删改查答案的时候才检查此逻辑，赞和踩答案 不检查此逻辑）
    if(ctx.params.questionId && answer.questionId !== ctx.params.questionId){
      ctx.throw(404,'该问题下没有此答案')
    }
    ctx.state.answer = answer
    await next()
  }

  async findById(ctx){
    const {fields=''} = ctx.query
    const selectFiels = fields.split(';').filter(f=>f).map(f => ' +'+f).join('')
    const answer = await Answer.findById(ctx.params.id).select(selectFiels).populate('answerer')
    ctx.body = answer
  }
  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:false}
    })
    const answerer = ctx.state.user._id
    const {questionId} = ctx.params
    const answer = await new Answer({ ...ctx.request.body,answerer,questionId}).save()
    ctx.body = answer
  }

  async checkAnswerer(ctx,next){
    const {answer} = ctx.state
    //questioner是引用类型objectId，所以要转换字符串
    if(answer.answerer.toString() !== ctx.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }

  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:false}
    })
    // const answer = await Answer.findByIdAndUpdate(ctx.params.id,ctx.request.body)
   await ctx.state.answer.updateOne(ctx.request.body)

    ctx.body = ctx.state.answer
  }
  async delete(ctx){
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}
module.exports = new AnswersCtl()