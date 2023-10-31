const cors = require('@koa/cors');
const serve = require('koa-static');
const mysql = require('mysql2/promise');
const router = require('koa-router')();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'qwejyx1004plm',
  database: 'elderHome'
});

router.get('/', async (ctx, next) => {
  await ctx.render('index')
})

//登录
router.post('/login', async (ctx, next) => {
  const connection = await pool.getConnection();
  console.log(ctx.request.body)
  try {
  	const [rows, fileds] = await connection.query(
  		`SELECT * FROM userInfo WHERE loginName = '${ctx.request.body.loginName}' AND password = ${ctx.request.body.password}`,
  	);
  	ctx.body = (rows.length == 1)
  } finally {
  	connection.release();
  }
})

module.exports = router
