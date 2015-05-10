/** Cron jobs in heroku (Heroku Scheduler)
 * Creates an on/off dyno running a new instance of worker.js every day (midnight)
 * The interval is decided in Heroku dashboard in Add-ons
 * Command: "node worker.js" should tell heroku to run this file
 * This worker contains one function that deletes events whose expiration date is in the past.
 * The integer in the pgsql query specifies how many days we would like to extend it by if we need to.
 * Query can also be done by requiring the user model, but the current_date in pgsql has been deprecated.
 */
function deleteOld() {
  var knex =  !process.env.DATABASE_URL ? require('./app/local_config.js') :
    require('knex')({
      client: 'pg',
      connection: process.env.DATABASE_URL
    });
  // var User =  require('./app/models/user.js');
  knex.raw("delete from events where expiration < current_date + integer '0'")
    // knex.select('*')
    // .from('users')
    .then(function(resp){
      console.log('deleting',resp);
      process.exit();
    });
  // new User()
  //   .query('where','created_at','<','current_date')
  //     .fetchAll()
  //     .then(function(collection) {
  //       console.log('fsdfds',collection.models);
  //       process.exit();
  //     })
  //     .catch(function(err){
  //        console.error(err);
  //     });
}

deleteOld();
