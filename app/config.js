var Bookshelf = require('bookshelf');

var knex =  !process.env.DATABASE_URL ? require('./local_config.js') :
  require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

var db = require('bookshelf')(knex);
db.plugin('registry');

/**
 * Columns email, firstName, lastName, shippingAddress and phoneNumber are currently not being used.
 */
db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.string('email', 100);
      user.string('venmoUsername', 255);
      user.string('venmoDisplayName', 255);
      user.string('venmoUserId', 255);
      user.string('venmoAccessToken', 255);
      user.string('venmoRefreshToken', 255);
      user.string('venmoPicture', 255);
      user.string('firstName', 100);
      user.string('lastName', 100);
      user.string('shippingAddress', 255);
      user.string('phoneNumber', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('events').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('events', function (event) {
      event.increments('id').primary();
      event.string('title', 255);
      event.text('description');
      event.string('image',255);
      event.dateTime('expiration');
      event.string('user_id', 100);
      event.integer('invites');
      event.integer('thresholdPeople');
      event.integer('thresholdMoney');
      event.integer('committedPeople');
      event.integer('committedMoney');
      event.boolean('paid');
      event.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('invites').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('invites', function (invite) {
      invite.increments('id').primary();
      invite.string('user_id', 255);
      invite.string('event_id', 255);
      invite.boolean('joined');
      invite.boolean('declined');
      invite.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;
