const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = username =>
  users.some(user => user.username === username);

const authenticatedUser = (username, password) =>
  users.some(user => user.username === username && user.password === password);

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const accessToken = jwt.sign(
    { username },
    process.env.JWT_SECRET || "fingerprint_customer",
    { expiresIn: "1h" }
  );
  return res.json({ message: "Login successful.", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  const { review } = req.body || {};
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ message: "A review is required." });
  }

  book.reviews[req.user.username] = review;
  return res.json({
    message: "Review added or updated successfully.",
    reviews: book.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.user.username)) {
    return res.status(404).json({ message: "Review not found." });
  }

  delete book.reviews[req.user.username];
  return res.json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
