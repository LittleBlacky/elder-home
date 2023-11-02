const mysql = require('mysql2/promise');
const router = require('koa-router')();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'qwejyx1004plm',
    database: 'elderHome'
});

router.prefix('/family');

//给定页数，查找指定类型的所有用户
//前端给出 ['page': , 'loginName': ]
//OP为需要查询的指定数据名
router.post('/search', async (ctx, next) => {
    let page = (parseInt(ctx.request.body.page)-1)*10;
    let loginName = ctx.request.body.loginName;
    if(loginName === '')
        loginName = '%';
    const connection = await pool.getConnection();
    try {
        let [rows, fileds] = await connection.query(
            `SELECT * FROM family
             WHERE loginName LIKE ${loginName} 
		     LIMIT ${page}, 10`,
        );
        let result = {};
        result['result'] = rows;
        rows = await connection.query(
            `SELECT COUNT(*) as total FROM family 
             WHERE loginName LIKE ${loginName}`,
        );
        //console.log(rows[0]['total'])
        result['total'] = rows[0][0]['total'];
        //console.log(result)
        ctx.body = result;
    } finally {
        connection.release();
    }
})

//增加指定用户
//前端数据：[loginName: , familyName: , relations: , telephone: ]
router.post('/add', async (ctx, next) => {
    const connection = await pool.getConnection();
    let loginName = ctx.request.body.loginName;
    let familyName = ctx.request.body.familyName;
    let relations = ctx.request.body.relations;
    let telephone = ctx.request.body.telephone;
    try {
        const [rows, fileds] = await connection.query(
            `INSERT INTO \`family\`(\`loginName\`, \`familyName\`, \`relations\`, \`telephone\`) 
         VALUES('${loginName}', '${familyName}', '${relations}', '${telephone}')`,
        );
        ctx.body = 'ok';
    } finally {
        connection.release();
    }
})

//从指定表中删除指定用户
//若没给定表，则全部删除
//[loginName: , familyName: ]
router.post('/delete', async (ctx, next) => {
    const connection = await pool.getConnection();
    let familyName = ctx.request.body.familyName;
    let loginName = ctx.request.body.loginName;
    try {
        await connection.query(
            `DELETE FROM ${family} WHERE loginName = ${loginName} AND familyName = ${familyName}`,
        );
        ctx.body = 'ok';
    } finally {
        connection.release();
    }
})

module.exports = router;