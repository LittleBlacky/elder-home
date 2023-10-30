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

router.get('/login', async (ctx, next) => {
  const connection = await pool.getConnection();
  try {
  	const [rows, fileds] = await connection.query(
  		`SELECT * FROM login WHERE loginName = '${123}' AND password = ${123}`,
  	);
  	ctx.body = (rows.length == 1)
  } finally {
  	connection.release();
  }
})

module.exports = router
