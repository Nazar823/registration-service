const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        dialect: process.env.DIALECT,
        host: process.env.HOST
    }
)
const user = require('./user')(sequelize)
console.log('Подключение через модуль')
module.exports = {
    sequelize: sequelize,
    user: user
}