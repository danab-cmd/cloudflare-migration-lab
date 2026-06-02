const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "lab-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);

app.use(express.static("public"));

const posts = [
  {
    id: 1,
    title: "Cloudflare Migration",
    content: "Learning Cloudflare step by step."
  },
  {
    id: 2,
    title: "Caching Basics",
    content: "Understanding cache hits and misses."
  }
];

const users = [
  {
    username: "admin",
    password: "password"
  }
];

function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Authentication required." });
}

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  const existingUser = users.find((item) => item.username === username);

  if (existingUser) {
    return res.status(409).json({ success: false, message: "Username already exists." });
  }

  users.push({ username, password });

  res.status(201).json({ success: true, message: "Signup successful. Please log in." });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (item) => item.username === username && item.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }

  req.session.user = { username: user.username };

  res.json({ success: true, message: "Logged in successfully.", user: req.session.user });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out successfully." });
  });
});

app.get("/api/auth", (req, res) => {
  res.json({
    isLoggedIn: Boolean(req.session && req.session.user),
    user: req.session.user || null
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/api/posts", (req, res) => {
  res.json(posts);
});

app.post("/api/posts", requireAuth, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required."
    });
  }

  const nextId = posts.length ? Math.max(...posts.map((post) => post.id)) + 1 : 1;

  const newPost = {
    id: nextId,
    title,
    content
  };

  posts.push(newPost);

  res.status(201).json({
    success: true,
    message: "Post created successfully.",
    post: newPost
  });
});

app.post("/api/contact", (req, res) => {
  console.log("Contact Form Submitted");

  console.log(req.body);

  res.json({
    success: true,
    message: "Form received"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});