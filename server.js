const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const postRoutes = require("./server/routes/postRoutes.js");
const authRoutes = require("./server/routes/authRoutes.js");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes should come BEFORE wildcard routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, 'client')));

// ✅ Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// ✅ Wildcard fallback for SPA — must be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    )
  )
  .catch((err) => console.error(err));
