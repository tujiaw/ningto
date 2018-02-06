const path = require('path')
const logger = require('koa-logger')
const route = require('koa-route')
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser')
const co = require('co')
const render = require('koa-swig')
const config = require('./config')
const session = require('koa-session');
const serve = require('koa-static')
const Koa = require('koa')
const cors = require('koa2-cors')
const app = new Koa()
app.use(cors())

const SessionConfig = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 3600000, /** 1个小时 (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
}
app.keys = ['sdds34sdfs4654635dggsdgdsg']
app.use(logger())
app.use(serve(path.join(__dirname, 'public')))
app.use(session(SessionConfig, app))
app.use(koaBody({ multipart: true }))
app.use(bodyParser({
  formLimit: '2mb'
}))
app.context.render = co.wrap(render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 'memory',
  ext: 'html',
}))

require('./routes/routes')(app, route)

app.listen(config.port, () => {
  console.log('listening on port ' + config.port)
})
