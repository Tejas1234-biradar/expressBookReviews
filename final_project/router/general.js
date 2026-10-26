const express = require('express');
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || !username.trim() ||
      typeof password !== 'string' || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  const allBooks = await Promise.resolve(books);
  return res.json(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const book = await Promise.resolve(books[req.params.isbn]);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  return res.json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLocaleLowerCase();
  const matchingBooks = await Promise.resolve(
    Object.values(books).filter(book => book.author.toLocaleLowerCase() === author)
  );
  return res.json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLocaleLowerCase();
  const matchingBooks = await Promise.resolve(
    Object.values(books).filter(book => book.title.toLocaleLowerCase() === title)
  );
  return res.json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const book = await Promise.resolve(books[req.params.isbn]);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  return res.json(book.reviews);
});

module.exports.general = public_users;
