const express = require("express");

const router = express.Router();

const {
  createNote,
  getNotes,
  deleteNote,
  updateNote,
} = require("../controllers/noteController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createNote);

router.get("/", protect, getNotes);

router.delete("/:id", protect, deleteNote);

router.put("/:id", protect, updateNote);

module.exports = router;