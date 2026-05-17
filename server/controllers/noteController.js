const validator = require("validator");
const Note = require("../models/Note");

// GET NOTES
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// CREATE NOTE
exports.createNote = async (req, res) => {
  try {
    let { title, content } = req.body;

    // VALIDATION
    if (!title || !content) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // SANITIZE
    title = validator.escape(title.trim());
    content = validator.escape(content.trim());

    // LIMITS
    if (title.length > 100) {
      return res.status(400).json({
        message: "Title too long",
      });
    }

    if (content.length > 5000) {
      return res.status(400).json({
        message: "Content too long",
      });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user.id,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE NOTE
exports.updateNote = async (req, res) => {
  try {
    let { title, content } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // SANITIZE
    if (title) {
      title = validator.escape(title.trim());

      if (title.length > 100) {
        return res.status(400).json({
          message: "Title too long",
        });
      }

      note.title = title;
    }

    if (content) {
      content = validator.escape(content.trim());

      if (content.length > 5000) {
        return res.status(400).json({
          message: "Content too long",
        });
      }

      note.content = content;
    }

    const updatedNote = await note.save();

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE NOTE
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await note.deleteOne();

    res.json({
      message: "Note deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};