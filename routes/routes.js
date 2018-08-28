'use strict'

const Posts = require('../controller/posts')
const User = require('../controller/user')
const Qiniu = require('../controller/qiniu')
const Extends = require('../controller/extends')

let hitToday = 0;
setInterval(() => {
  if (new Date().getHours() === 0 && new Date().getMinutes() === 0) {
    hitToday = 0;
  }
}, 10000);

module.exports = function(app, route) {
  app.use(async (ctx, next) => {
    const totalhit = await Extends.addHit(ctx.path);
    const globalData = {
      totalhit: totalhit, 
      todayhit: ++hitToday
    }
    if (ctx.session.user) {
      globalData.user = ctx.session.user
    }
    ctx.state = Object.assign(ctx.state, globalData);
    await next();
  })

  app.use(route.get('/api/', Posts.list))
  app.use(route.get('/api/title', Posts.title))
  app.use(route.get('/api/list', Posts.list))
  app.use(route.get('/api/post/:id', Posts.show))
  app.use(route.get('/api/rightsidebar', Posts.rightsidebar))
  app.use(route.get('/api/githublogin', User.apiGithubLogin))
  app.use(route.post('/api/comments/add', Comments.add))
  
  app.use(route.get('/', Posts.list))
  app.use(route.get('/list', Posts.list))

  app.use(route.get('/write', Posts.write))
  app.use(route.get('/post/:id', Posts.show))
  app.use(route.get('/archives', Posts.archives))
  app.use(route.get('/search', Posts.search))
  app.use(route.get('/titlesearch', Posts.titleSearch))
  app.use(route.get('/remove/:id', Posts.remove))
  app.use(route.get('/edit/:id', Posts.edit))

  app.use(route.get('/tags/:name', Posts.tags))
  app.use(route.get('/picture_wall', Posts.pictureWall))

  app.use(route.post('/add', Posts.reqAdd))
  app.use(route.post('/edit', Posts.reqEdit))
  app.use(route.post('/search', Posts.reqSearch))
  app.use(route.post('/hotsearch', Posts.reqHotSearch))
  app.use(route.get('/user/signin', User.signin))
  app.use(route.get('/user/githublogin', User.githubLogin))
  app.use(route.get('/user/githubrelogin', User.githubRelogin))
  app.use(route.get('/user/signout', User.signout))
  app.use(route.post('/user/signin', User.reqSignin))

  app.use(route.get('/uptoken', Qiniu.uptoken))

  app.use(route.get('/about', Extends.about))

  app.use(route.get('/program', Extends.program))
  app.use(route.get('/programupload', Extends.programUpload))
  app.use(route.get('/mdviewer', Extends.mdviewer))
  app.use(route.get('/createpostlist', Extends.createpostlist))

  app.use(route.post('/mdfile', Extends.mdfile))

  app.use(route.get('/github_oauth_callback_comment', User.githubOAuthCallbackComment))

  app.use(route.get('/eval/:evalEncode', Extends.eval))
}