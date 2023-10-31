const cors = require('@koa/cors');
const serve = require('koa-static');
const mysql = require('mysql2/promise');
const {parse} = require("nodemon/lib/cli");
const router = require('koa-router')();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'qwejyx1004plm',
  database: 'elderHome'
});

router.prefix('/domitory');
//查找宿舍
//[domitoryID: '', page: ]
//如果为空，意味着查找指定页的内容
router.post('/search',  async (ctx, next) => {
  const connection = await pool.getConnection();
  let domitoryID = ctx.request.body.domitoryID;
  let page = (ctx.request.body.page-1)*10;
  let result = {};
  if(domitoryID === null || domitoryID === '')
    domitoryID = '%';
  else
    page = 0;
  try {
    let [rows, fileds] = await connection.query(
        `SELECT domitory.domitoryID, (2-COUNT(*)) AS counts, GROUP_CONCAT(userinfo.loginName) AS loginID
         FROM domitory
         JOIN userinfo ON domitory.loginName = userinfo.loginName
         WHERE domitory.domitoryID LIKE '${domitoryID}'
         GROUP BY domitory.domitoryID
         LIMIT ${page}, 10`,
    );
    result['result'] = rows;
    rows = [];
    [rows, fileds] = await connection.query(
        `SELECT COUNT(*) as total FROM domitory`,
    );
    result['total'] = rows[0][0];
    ctx.body = result;
  } finally {
    connection.release();
  }
})

module.exports = router;
