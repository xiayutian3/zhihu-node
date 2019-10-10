const Comment = require('../models/comments')


//问题答案 接口


class CommentsCtl {

  async find(ctx){
    const {per_page=10}= ctx.query
    const page = Math.max(ctx.query.page*1,1) - 1
    const perPage = Math.max(per_page*1,1);

    const q = new RegExp(ctx.query.q)
    const {questionId,answerId} = ctx.params
    const {rootCommentId} = ctx.query  //*****(可有可无)如果有rootCommentId，就认为请求2级评论******

    // ctx.body = await Comment.find({$or:[{content:q},{description:q}]}) //mongoose提供的语法糖，用正则进行模糊匹配
    ctx.body = await Comment.find({content:q,questionId,answerId,rootCommentId}) //精准匹配
    // .limit(perPage).skip(page*perPage).populate('commentator rootCommentId replyTo')   //不加select 也可以直接返回内容
    .limit(perPage).skip(page*perPage).select('+commentator +rootCommentId +replyTo').populate('commentator rootCommentId replyTo')

  }
  async checkCommentExist(ctx,next){
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if(!comment){ctx.throw(404,'评论不存在')}
    //只有路由中存在questionId，才执行（只有删改查答案的时候才检查此逻辑，赞和踩答案 不检查此逻辑）
    if(ctx.params.questionId && comment.questionId !== ctx.params.questionId){
      ctx.throw(404,'该问题下没有此评论')
    }
    if(ctx.params.answerId && comment.answerId !== ctx.params.answerId){
      ctx.throw(404,'该答案下没有此评论')
    }
    ctx.state.comment = comment
    await next()
  }

  async findById(ctx){
    const {fields=''} = ctx.query
    const selectFiels = fields.split(';').filter(f=>f).map(f => ' +'+f).join('')
    const comment = await Comment.findById(ctx.params.id).select(selectFiels).populate('commentator')
    ctx.body = comment
  }
  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:false},
      rootCommentId:{type:'string',required:false},       //增添2级评论
      replyTo:{type:'string',required:false}              //增添2级评论
    })
    const commentator = ctx.state.user._id
    const {questionId,answerId} = ctx.params
    const comment = await new Comment({ ...ctx.request.body,commentator,questionId,answerId}).save()
    ctx.body = comment
  }

  async checkCommentator(ctx,next){
    const {comment} = ctx.state
    //questioner是引用类型objectId，所以要转换字符串
    if(comment.commentator.toString() !== ctx.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }

  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:false}
    })
    const {content} = ctx.request.body   //*****主要是防止 如果是二级评论的话，那永远是某个一级评论的二级评论，不能修改一级评论,所以只允许更新content属性
    // const comment = await Comment.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    await ctx.state.comment.updateOne({content})

    ctx.body = ctx.state.comment
  }
  async delete(ctx){
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}
module.exports = new CommentsCtl()