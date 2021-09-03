const Sequelize = require('sequelize')

module.exports = function (sequelize){
    return sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        mail: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false
    })
}