'use strict'

const Posts = require('../controller/posts')
const User = require('../controller/user')
const Qiniu = require('../controller/qiniu')
const Extends = require('../controller/extends')
const Comments = require('../controller/comments')
const Joke = require('../controller/joke')
const Laifu = require('../controller/laifu')
const Crontab = require('../controller/crontab')
const Poetry = require('../controller/poetry')

module.exports = function(app, route) {
  app.use(async (ctx, next) => {
    const totalhit = await Extends.addHit(ctx.path);
    const globalData = {
      totalhit: totalhit, 
      todayhit: Crontab.incHitToday()
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
  app.use(route.get('/api/comments/:postId', Comments.getByPostId))
  app.use(route.get('/api/textjoke', Joke.getTextJoke))
  
  app.use(route.get('/showapi/laifu', Laifu.fetchfromshowapi))
  app.use(route.get('/showapi/textjoke', Joke.fetchfromshowapi))
  
  app.use(route.get('/', Posts.list))
  app.use(route.get('/list', Posts.list))

  app.use(route.get('/write', Posts.write))
  app.use(route.get('/post/:id', Posts.show))
  app.use(route.get('/archives', Posts.archives))
  app.use(route.get('/search', Posts.search))
  app.use(route.get('/titlesearch', Posts.titleSearch))
  app.use(route.get('/remove/:id', Posts.remove))
  app.use(route.get('/edit/:id', Posts.edit))
  app.use(route.post('/comments/add', Comments.reqAdd))
  app.use(route.post('/comments/remove', Comments.reqRemove))

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
  app.use(route.get('/captcha', Extends.captcha))
  app.use(route.get('/textjoke', Joke.textJoke))
  app.use(route.get('/poetry', Poetry.main))
  app.use(route.get('/poetry/search', Poetry.search))
  app.use(route.get('/poetry/random/tang', Poetry.randomTang))
}

