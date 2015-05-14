var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'ec2-54-163-227-94.compute-1.amazonaws.com',
    port     : '5432',
    user     : 'uqqwlmlvuvwsex',
    password : 'YA80aGKnsXj8JpD_1fR9JLI1yl',
    database : 'diphi6ikkn5qf',
    charset  : 'utf8',
    ssl      : true
  }
});

module.exports = knex;