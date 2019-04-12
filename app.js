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
const { sendToSumscope } = require('./utils/sendmail')
const fs = require('fs')

const log4js = require('log4js')
log4js.configure('./config/log4js.json')
const applog = log4js.getLogger()
const httplog = log4js.getLogger('http')

const app = new Koa()
app.use(cors())

if (!fs.existsSync('./log')) { fs.mkdirSync('./log') }

const SessionConfig = {
  key: 'ningto:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000 / 2,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}

app.keys = ['7BBF9DD3-4C79-4D6A-8220-25605F87E8FA']
app.use(logger((str, args) => {
  httplog.debug(str)
}))
app.use(serve(path.join(__dirname, 'public')))
app.use(session(SessionConfig, app))
app.use(koaBody({ multipart: true }))
app.use(bodyParser({ formLimit: '2mb' }))
app.context.render = co.wrap(render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 'memory',
  ext: 'html',
}))
app.on('error', (err, ctx) => {
    applog.error(err)
})
require('./routes/routes')(app, route)
app.listen(config.port, () => {
  applog.info('listening on port ' + config.port)
})

