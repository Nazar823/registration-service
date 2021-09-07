const Sequelize = require('sequelize')

module.exports = function (sequelize){
    return sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: Sequelize.CHAR,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.CHAR,
            allowNull: false
        },
        password: {
            type: Sequelize.CHAR,
            allowNull: false
        }
    }, {
        timestamps: false
    })
}