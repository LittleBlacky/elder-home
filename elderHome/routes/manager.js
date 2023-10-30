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

router.prefix('/manager')

router.get('/', async (ctx, next) => {
  await ctx.render('manager')
})

//查找所有管理员用户
//前端给出 ['page': ]
router.get('/account/manager/all', async (ctx, next) => {
  let page = (ctx.request.query.page-1)*10;
  const connection = await pool.getConnection();
  try {
  	const [rows, fileds] = await connection.query(
  		`SELECT userinfo.loginName, userName, telephone, sex FROM userInfo 
		INNER join login on userInfo.loginName=login.loginName
		WHERE login.type = 2
		LIMIT ${page}, 10`,
  	);
  	ctx.body = rows
  } finally {
  	connection.release();
  }
})

//查找所有普通用户
//前端给出 ['page': ]
router.get('/account/user/all', async (ctx, next) => {
  let page = (ctx.request.query.page-1)*10;
  const connection = await pool.getConnection();
  try {
  	const [rows, fileds] = await connection.query(
  		`SELECT userinfo.loginName, userName, telephone, sex FROM userInfo 
  		INNER join login on userInfo.loginName=login.loginName
  		WHERE login.type = 1 
		LIMIT ${page}, 10`,
  	);
  	ctx.body = rows
  } finally {
  	connection.release();
  }
})

//查找指定用户
router.get('/account/user', async (ctx, next) => {
  const connection = await pool.getConnection();
  try {
  	const [rows, fileds] = await connection.query(
  		`SELECT loginName, userName, telephone, sex FROM userInfo 
		 WHERE loginName = '${ctx.request.query.userName}'`,
  	);
  	ctx.body = rows
  } finally {
  	connection.release();
  }
})

//增加指定用户
//前端数据：[loginName: , userName: , sex: , telephone]
router.get('/account/add', async (ctx, next) => {
  const connection = await pool.getConnection();
  try {
  	const [rows, fileds] = await connection.query(
  		`INSERT INTO \`userInfo\`(\`loginName\`, \`userName\`, \`sex\`, \`telephone\`) VALUES('${ctx.request.query.loginName}', '${ctx.request.query.userName}', ${ctx.request.query.sex}, '${ctx.request.query.telephone}')`,
  	);
  	ctx.body = 'ok'
	console.log(rows)
  } finally {
	  ctx.body = 'no'
  	connection.release();
  }
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
