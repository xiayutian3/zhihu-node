const path = require('path')
class HomeCtl {
  index(ctx){
    ctx.body = '<h1>这是主页<h1>'
  }
  upload(ctx){
    const file = ctx.request.files.file
    //basename  就是文件名称加上扩展名  例如 xxx.png
    const basename = path.basename(file.path)
    ctx.body = {
      url: `${ctx.origin}/uploads/${basename}`
    }
  }
}

module.exports = new HomeCtl();