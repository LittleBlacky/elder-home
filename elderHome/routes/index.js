const cors = require('@koa/cors');
const serve = require('koa-static');
const mysql = require('mysql2/promise');
const router = require('koa-router')();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'qwejyx1004plm',
  database: 'js20080111'
});

router.get('/', async (ctx, next) => {
  await ctx.render('index')
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
