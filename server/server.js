// server/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

/* =========================
   SECURITY MIDDLEWARES
========================= */

// Secure HTTP headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many requests, please try again later.",
});

app.use(limiter);

/* =========================
   BASIC MIDDLEWARES
========================= */

app.use(cors());

app.use(express.json());

// Prevent NoSQL Injection
app.use(mongoSanitize());

// Prevent XSS
app.use(xss());

/* =========================
   DATABASE
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

/* =========================
   ROUTES
========================= */

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/notes",
  require("./routes/noteRoutes")
);

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Secure Vault API Running...");
});

/* =========================
   ERROR HANDLER
========================= */

app.use(errorHandler);

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});