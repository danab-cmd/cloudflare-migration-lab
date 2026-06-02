const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});

app.get("/api/posts", (req, res) => {
  res.json(posts);
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