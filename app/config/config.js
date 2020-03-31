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
    use_env_variable: process.env.DATABASE_URL,
    logging: false,
    dialect: 'postgres'
  }
}
