const express = require("express");
const app = express();
require("dotenv").config();
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const sequelize = require("./config/database");
const User = require("./models/User");
const Post = require("./models/Post");

const PORT = process.env.DB_PORT;
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes); 

const defaultUsers = [
  {
    name: 'John Doe',
    mobile_number: 1234567890,
    address: '123 Main St',
    post_count: 0,
  },
  {
    name: 'Jane Smith',
    mobile_number: 2345678901,
    address: '456 Elm St',
    post_count: 0,
  },
  {
    name: 'Mark Wilson',
    mobile_number: 3456789012,
    address: '789 Oak St',
    post_count: 0,
  },
];

const defaultPosts = [
  {
    title: 'Understanding JavaScript Closures',
    description: 'Closures are one of the most important concepts in JavaScript. Learn how they work and how to use them effectively in your code.',
    user_id: 1,  // Assuming user with ID 1 exists
    images: JSON.stringify(['js_closures_image1.jpg', 'js_closures_image2.jpg']),
  },
  {
    title: 'Introduction to Node.js',
    description: 'Node.js is a powerful runtime for building server-side applications using JavaScript. Here is an introduction to getting started with Node.',
    user_id: 1,  // Assuming user with ID 1 exists
    images: JSON.stringify(['nodejs_intro_image1.jpg']),
  },
  {
    title: 'Mastering React: A Beginner\'s Guide',
    description: 'React is one of the most popular front-end frameworks for building interactive user interfaces. This guide will help you get started with React.',
    user_id: 2,  // Assuming user with ID 2 exists
    images: JSON.stringify(['react_beginners_image1.jpg', 'react_beginners_image2.jpg']),
  },
  {
    title: 'Exploring the Power of SQL Databases',
    description: 'SQL databases have been around for decades, and they are still widely used today for storing structured data. This post explores some key concepts.',
    user_id: 2,  // Assuming user with ID 2 exists
    images: JSON.stringify(['sql_databases_image1.jpg']),
  },
  {
    title: '10 Best Practices for Writing Clean Code',
    description: 'Writing clean and maintainable code is essential for long-term software projects. In this post, we will discuss 10 best practices for writing clean code.',
    user_id: 3,  // Assuming user with ID 3 exists
    images: JSON.stringify(['clean_code_image1.jpg', 'clean_code_image2.jpg']),
  },
  {
    title: 'Exploring Machine Learning Algorithms',
    description: 'Machine learning is revolutionizing the world of technology. In this post, we will explore various algorithms used in machine learning.',
    user_id: 3,  // Assuming user with ID 3 exists
    images: JSON.stringify(['ml_algorithms_image1.jpg', 'ml_algorithms_image2.jpg']),
  }
];

const initializeDBAndServer = async () => {
  try {
    await sequelize.sync({ force: false }); 
    console.log("Database synchronizied successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });

    const usersCount = await User.count();
    if (usersCount === 0) {
      await User.bulkCreate(defaultUsers);
      console.log('Default users created successfully!');
    }

    const postsCount = await Post.count();
    if (postsCount === 0) {
      await Post.bulkCreate(defaultPosts);
      console.log('Default posts created successfully!');
    }

  } catch (error) {
    console.log(`Error during database synchronization: ${error}`);
  }
};

initializeDBAndServer();

