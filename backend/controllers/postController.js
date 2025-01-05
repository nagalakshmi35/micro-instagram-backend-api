const Post = require("../models/Post");
const User = require("../models/User");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPostsForUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const posts = await Post.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ["name", "mobile_number", "address"],
        },
      ],
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts for user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPostForUser = async (req, res) => {
  const userId = req.params.userId;
  const { title, description, images } = req.body;
  const transaction = await Post.sequelize.transaction();

  try {
    const post = await Post.create(
      {
        title,
        description,
        user_id: userId,
        images: JSON.stringify(images),
      },
      { transaction }
    );

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ post_count: user.post_count + 1 }, { transaction });

    await transaction.commit();

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;
  const { title, description, images } = req.body;

  try {
    const post = await Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== parseInt(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this post" });
    }

    const updatedPost = await post.update({
      title,
      description,
      images: JSON.stringify(images),
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const post = await Post.findOne({ where: { id: postId, user_id: userId } });

    if (!post) {
      return res
        .status(404)
        .json({
          message: "Post not found or not authorized to delete this post",
        });
    }

    await post.destroy();

    await User.increment({ post_count: -1 }, { where: { id: userId } });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllPosts,
  getAllPostsForUser,
  createPostForUser,
  updatePost,
  deletePost,
};
