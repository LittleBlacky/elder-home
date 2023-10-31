const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const cors = require('@koa/cors');
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const login = require('./routes/login')
const users = require('./routes/domitory')
const account = require('./routes/account')
const goouter = require('./routes/goouter')
// error handler
onerror(app)

app.use(cors());
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'html'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(login.routes(), login.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(account.routes(), account.allowedMethods())
app.use(goouter.routes(), goouter.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
