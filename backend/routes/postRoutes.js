const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Route to get all posts
router.get("/", postController.getAllPosts);

// Route to get all posts for a specific user
router.get("/user/:userId", postController.getAllPostsForUser);

// Route to create a new post for a user
router.post("/user/:userId", postController.createPostForUser);

// Route to update a post by post ID for a user
router.put("/:postId/user/:userId", postController.updatePost);

// Route to delete a post by post ID for a user
router.delete("/:postId/user/:userId", postController.deletePost);

module.exports = router;
