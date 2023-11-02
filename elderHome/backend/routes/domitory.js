const mysql = require('mysql2/promise');
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
router.post('/search', async (ctx, next) => {
    const connection = await pool.getConnection();
    console.log(ctx.request.body)
    let domitoryID = ctx.request.body.domitoryID;
    let page = (parseInt(ctx.request.body.page) - 1) * 10;
    let result = {};
    let sql = ''
    if (domitoryID === null || domitoryID === '') {
        domitoryID = '%';
        sql = `SELECT domitory.domitoryID, (2-COUNT(*)) AS counts, GROUP_CONCAT(domitory.loginName) AS loginID
         FROM domitory
         WHERE domitory.domitoryID LIKE '${domitoryID}'
         GROUP BY domitory.domitoryID
         LIMIT ${page}, 10`;
    } else {
        sql = `SELECT domitory.loginName, userInfo.userName 
           FROM domitory 
           LEFT JOIN userInfo 
           ON userInfo.loginName = domitory.loginName
           WHERE domitoryID = '${domitoryID}'`;
    }
    try {
        let [rows, fileds] = await connection.query(
            sql,
        );
        result['result'] = rows;
        rows = [];
        [rows, fileds] = await connection.query(
            `SELECT COUNT(*) as total FROM (SELECT COUNT(*) FROM domitory GROUP BY domitoryID) s`,
        );
        result['total'] = rows[0]['total'];
        ctx.body = result;
    } finally {
        connection.release();
    }
})

// 宿舍增加人员
// /domitory/add
// [domitoryID: '', loginName: '']
router.post('/add', async (ctx, next) => {
    const connection = await pool.getConnection();
    let domitoryID = ctx.request.body.domitoryID;
    let loginName = ctx.request.body.loginName;
    try {
        let [rows, fileds] = await connection.query(
            `INSERT INTO \`domitory\`(\`loginName\`, \`domitoryID\`) VALUES ('${loginName}','${domitoryID}')`,
        );
        ctx.body = {result: 'ok'};
    } finally {
        connection.release();
    }
})

// 宿舍删除人员
// [loginName: '']
router.post('/delete', async (ctx, next) => {
    const connection = await pool.getConnection();
    let loginName = ctx.request.body.loginName;
    try {
        let [rows, fileds] = await connection.query(
            `DELETE FROM domitory WHERE loginName = '${loginName}'`,
        );
        ctx.body = {result: 'ok'};
    } finally {
        connection.release();
    }
})

module.exports = router;
