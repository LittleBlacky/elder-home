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

router.prefix('/account');

//给定页数，查找指定类型的所有用户
//前端给出 ['page': , 'type': , 'OP']
//OP为需要查询的指定数据名
router.post('/all', async (ctx, next) => {
    let page = (parseInt(ctx.request.body.page) - 1) * 10;
    let type = parseInt(ctx.request.body.type);
    let op = ctx.request.body.OP;
    if (op === null || op === '')
        op = 'loginName, userName, telephone, sex';
    const connection = await pool.getConnection();
    try {
        let [rows, fileds] = await connection.query(
            `SELECT ` + op + ` FROM userInfo
        WHERE type = ${type} 
		LIMIT ${page}, 10`,
        );
        let result = {};
        result['userInfo'] = rows;
        rows = await connection.query(
            `SELECT COUNT(*) as total FROM userInfo 
         WHERE type = ${type}`,
        );
        //console.log(rows[0]['total'])
        result['total'] = rows[0][0]['total'];
        //console.log(result)
        ctx.body = result;
    } finally {
        connection.release();
    }
})

//查找指定用户的指定内容
//loginName为字符串， OP为列表类型, talble为字符串
//[loginName: '', OP: [''], table: '']
router.get('/searchUser', async (ctx, next) => {
    const connection = await pool.getConnection();
    let table = ctx.request.query.table;
    let loginName = ctx.request.query.loginName;
    let OP = ctx.request.query.OP;
    let op = OP[0];
    if (OP.length === 0)
        op = '*';
    else
        for (let i = 0; i < OP.length; ++i)
            op += ', ' + OP[i];
    try {
        const [rows, fileds] = await connection.query(
            'SELECT ' + op + ` FROM ${table}` + `WHERE loginName = '${loginName}'`,
        );
        ctx.body = rows;
    } finally {
        connection.release();
    }
})

//增加指定用户
//前端数据：[loginName: , userName: , sex: , telephone: , type: ]
router.get('/add', async (ctx, next) => {
    const connection = await pool.getConnection();
    try {
        const [rows, fileds] = await connection.query(
            `INSERT INTO \`userInfo\`(\`loginName\`, \`userName\`, \`sex\`, \`telephone\`, \`password\`, \`type\`) 
         VALUES('${ctx.request.query.loginName}', '${ctx.request.query.userName}', ${ctx.request.query.sex}, '${ctx.request.query.telephone}', '123456', ${ctx.request.query.type})`,
        );
        ctx.body = 'ok';
    } finally {
        connection.release();
    }
})

//从指定表中删除指定用户
//若没给定表，则全部删除
//[table:[], loginName: ]
router.get('/delete', async (ctx, next) => {
    const connection = await pool.getConnection();
    let table = ctx.request.query.table;
    if (table.length === 0)
        table = ['domitory', 'family', 'leave', 'userinfo', 'goouter'];
    let loginName = ctx.request.query.loginName;
    try {
        for (let i = 0; i < table.length; ++i)
            await connection.query(
                `DELETE FROM ${table[i]} WHERE loginName = ${loginName}`,
            );
        ctx.body = 'ok';
    } finally {
        connection.release();
    }
})

//更新用户内容
//OP为指定表, content为内容, loginName为用户ID
//[OP:'', content: {'key':value, }, loginName: '']
router.post('/update', async (ctx, next) => {
    const connection = await pool.getConnection();
    console.log(ctx.request.body);
    let OP = ctx.request.body.OP;
    let content = {};
    content = ctx.request.body.content;
    let loginName = ctx.request.body.loginName;
    try {
        let sql = `UPDATE ${OP} SET `;
        let i = 0;
        for (const [key, values] of Object.entries(content)) {
            if (i > 0)
                sql += ', ';
            sql += `${key}='${values}'`;
            ++i;
        }
        sql += ` WHERE loginName = '${loginName}' `;
        //console.log(sql)
        await connection.query(
            sql
        );
        ctx.body = 'ok';
    } finally {
        connection.release();
    }
})

module.exports = router;