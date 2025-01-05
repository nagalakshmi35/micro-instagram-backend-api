const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 
const Post = require("./Post");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(256), 
    allowNull: false,
  },
  mobile_number: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  post_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
}); 

User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

module.exports = User;
