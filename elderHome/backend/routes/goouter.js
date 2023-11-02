const mysql = require('mysql2/promise');
const router = require('koa-router')();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'qwejyx1004plm',
    database: 'elderHome'
});

router.prefix('/goouter')

//请假申请
//leaveTime 和 backTime 必须是时间戳
//[leaveTime: 1, backTime: 1, event, loginName]
router.post('/add', async (ctx, next) => {
    const connection = await pool.getConnection();
    console.log(ctx.request.body);
    let loginName = ctx.request.body.content.loginName;
    let event = ctx.request.body.content.event;
    let leaveTime = parseInt(ctx.request.body.content.leaveTime);
    let backTime = parseInt(ctx.request.body.content.backTime);
    let eventID = (new Date()).valueOf().toString() + loginName;
    try {
        let [rows, fileds] = await connection.query(
            `INSERT INTO \`goouter\`(\`loginName\`, \`leaveTime\`, \`backTime\`, \`event\`, \`eventID\`, \`status\`) 
            VALUES('${loginName}', ${leaveTime}, ${backTime}, '${event}', '${eventID}', 1)`,
        );
        ctx.body = 'ok'
    } finally {
        connection.release();
    }
})

//审核查询
//{loginName:, page:}
//如果为空，那么就是全部查询
router.post('/search', async (ctx, next) => {
    const connection = await pool.getConnection();
    let loginName = ctx.request.body.loginName;
    let page = (parseInt(ctx.request.body.page) - 1) * 10;
    let nowTime = (new Date()).valueOf();
    let result = {}
    //console.log(ctx.request.body)
    if (loginName === '')
        loginName = '%'
    try {
        let [rows, fileds] = await connection.query(
            `SELECT loginName, leaveTime, backTime,
                case when backTime > ${nowTime} then 2
                else goouter.status end as status,
                eventID, event
            FROM goouter 
            WHERE loginName LIKE '${loginName}'
            LIMIT ${page}, 10`,
        );
        result['result'] = rows
        rows = []
            [rows, fileds] = await connection.query(
            `SELECT COUNT(*) as total FROM goouter`,
        );
        //console.log(rows)
        result['total'] = rows[0][0]['total']
        //console.log(result)
        ctx.body = result
    } finally {
        connection.release();
    }
})

//审核出门申请
//[eventID:'', OP:]
//OP: -1驳回，0审核中, 1通过, 2超时
router.post('/check', async (ctx, next) => {
    //const connection = await pool.getConnection();
    let eventID = ctx.request.body.eventID;
    let status = parseInt(ctx.request.body.OP);
    try {
        let [rows, fileds] = await connection.query(
            `UPDATE goouter SET status = ${status} WHERE eventID = '${eventID}'`,
        );
        ctx.body = {result: 'ok'};
    } finally {
        connection.release();
    }
})

module.exports = router
