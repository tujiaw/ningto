'use strict'

const Posts = require('../controller/posts')
const User = require('../controller/user')
const Qiniu = require('../controller/qiniu')
const Extends = require('../controller/extends')

module.exports = function(app, route) {
  app.use(async (ctx, next) => {
    Extends.addHit(ctx.path);
    await next();
  })

  app.use(route.get('/', Posts.list))

  app.use(route.get('/list', Posts.list))
  app.use(route.get('/write', Posts.write))
  app.use(route.get('/post/:id', Posts.show))
  app.use(route.get('/archives', Posts.archives))
  app.use(route.get('/search', Posts.search))
  app.use(route.get('/remove/:id', Posts.remove))
  app.use(route.get('/edit/:id', Posts.edit))
  app.use(route.get('/tags/:name', Posts.tags))
  app.use(route.post('/add', Posts.reqAdd))
  app.use(route.post('/edit', Posts.reqEdit))
  app.use(route.post('/search', Posts.reqSearch))
  app.use(route.post('/hotsearch', Posts.reqHotSearch))

  app.use(route.get('/user/signin', User.signin))
  app.use(route.get('/user/signout', User.signout))
  app.use(route.post('/user/signin', User.reqSignin))

  app.use(route.get('/uptoken', Qiniu.uptoken))

  app.use(route.get('/about', Extends.about))

  app.use(route.get('/program', Extends.program))
  app.use(route.get('/programupload', Extends.programUpload))
  app.use(route.get('/mdviewer', Extends.mdviewer))
  app.use(route.get('/createpostlist', Extends.createpostlist))

  app.use(route.post('/mdfile', Extends.mdfile))
}