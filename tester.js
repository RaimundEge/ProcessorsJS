var Client = require('mariasql');

var c = new Client({
  host: '127.0.0.1',
  user: 'student',
  password: 'student',
  db: 'csci467'
});

var name = null;
c.query('SELECT * FROM customers WHERE id = 10', function(err, rows) {
  if (err)
    throw err;
  console.dir(rows);
  if (rows.info.numRows > 0) {
	name = rows[0].name;
	console.log(name);
  }
});
c.on('end', () => console.log('done: '+ name));
c.end();
