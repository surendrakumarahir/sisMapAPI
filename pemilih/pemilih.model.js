const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Alamat1: { type: DataTypes.STRING, allowNull: false },
        Alamat2: { type: DataTypes.STRING, allowNull: false },
        Alamat3: { type: DataTypes.STRING, allowNull: false },
      
    };

    return sequelize.define('pemilih_2012', attributes);
}