const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Signup = require("./signupModel");

const Chat = sequelize.define("Chat", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "chat",   // ✅ maps to your MySQL table
  timestamps: false,
});

// Relation with user
Chat.belongsTo(Signup, { foreignKey: "userId" });

module.exports = Chat;
