const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');


initialize();
module.exports = db = {};
async function initialize() {
  //  create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password, database });
    //console.log("statat", connection.state);
  // if(connection.state === 'disconnected'){
  //   console.log('disconnected');
  // }
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
   db.connection = connection; 
//   connection.query(
//   'select * from pemilih_2012  limit 1',
//   function(err, results, fields) {
//    // console.log(err);
//     console.log(results); // results contains rows returned by server
//     //console.log(fields); // fields contains extra meta data about results, if available
//   }
// );
   // console.log(connection);
    // connect to db
   // const sequelize = new Sequelize(database, user, password, { host: host, port: port, dialect: 'mysql' });

    // init models and add them to the exported db object
   // db.Account = require('../accounts/account.model')(sequelize);
   // db.Pemilih = require('../pemilih/pemilih.model')(sequelize);
    //db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);

    // define relationships
 //   db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
  //  db.RefreshToken.belongsTo(db.Account);
    
  //  sync all models with database
 //  await sequelize.sync();
  
}

