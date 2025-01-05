const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Post.afterCreate(async (post, options) => {
  try {
    const user = await User.findByPk(post.user_id);
    if (user) {
      user.post_count += 1;
      await user.save();
      console.log(`Post count updated for user ${user.id}`);
    }
  } catch (error) {
    console.error("Error updating post count:", error);
  }
});

module.exports = Post;
