const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
  secret: process.env.SESSION_SECRET || "fingerprint_customer",
  resave: false,
  saveUninitialized: false
}));

app.use("/customer/auth/*", function auth(req, res, next) {
  const authorization = req.get("Authorization");
  const token = authorization && authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fingerprint_customer");
    req.user = { username: decoded.username };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired authorization token." });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
