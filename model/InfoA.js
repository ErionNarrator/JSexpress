const {DataTable, DataTypes} = require('sequelize');
const sequelize = require('../db/database');

module.exports = sequelize;

const InfoA = sequelize.define('infoA', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

})

module.exports = InfoA;