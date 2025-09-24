const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define model mapped to your existing 'signup' table
const Signup = sequelize.define('Signup', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(15),allowNull: false },

}, {
  tableName: 'signup', 
  timestamps: false    
});

module.exports = Signup; 