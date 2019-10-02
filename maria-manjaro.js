var Client = require('mariasql');

module.exports = {
    find: function (poData) {
        console.log('mariadb find');
        var c = new Client({
            host: '127.0.0.1',
            user: 'student',
            password: 'student',
            db: 'csci467'
        });

        c.query('SELECT * FROM customers WHERE id = ' + poData.custid, function (err, rows) {
            if (err)
                throw err;
            // console.dir(rows);
            if (rows.info.numRows > 0) {
                poData.name = rows[0].name;
                // console.log(poData.name);
            } else {
                poData.errors = ['customer id not found'];
            }
        });
        c.end();
        return c;
    }
};