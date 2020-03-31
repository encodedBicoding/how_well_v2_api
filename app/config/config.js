const { config } = require('dotenv');
config();
module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: null,
    database: process.env.DEV_DB,
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "root",  
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    use_env_variable: 'postgres://rxlbpkdywezojw:d747179ed45596689d155b74f1d55ec891438991038eec7a1b80710aecd9cc86@ec2-54-159-112-44.compute-1.amazonaws.com:5432/ddicb31jqo3jmr',
    logging: false,
    dialect: 'postgres'
  }
}
