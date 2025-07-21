const notesModel = require("../Models/notesModel");
const mongoose = require("mongoose");

// ✅ Helper to ensure formatted response (keeps date/time clean)
const formatNoteResponse = (note) => ({
  id: note._id.toString(),
  title: note.title,
  content: note.content,
  createdDate: note.createdDate,
  createdTime: note.createdTime,
  updatedDate: note.updatedDate,
  updatedTime: note.updatedTime,
  createdBy: note.createdBy,
});

// ✅ Create a new note
exports.createNotes = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: "fail",
        message: "Title and content are required.",
      });
    }

    const createdNote = await notesModel.create({
      title,
      content,
      createdBy: req.user.email,
    });

    res.status(201).json({
      status: "success",
      data: formatNoteResponse(createdNote.toObject()),
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Update an existing note
exports.updateNotes = async (req, res, next) => {
  try {
    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid note ID.",
      });
    }

    const updateData = { ...req.body };
    if (updateData.createdBy) delete updateData.createdBy;

    const updatedNote = await notesModel.findOneAndUpdate(
      { _id: noteId, createdBy: req.user.email },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found or you don't have permission to edit this note.",
      });
    }

    res.status(200).json({
      status: "success",
      data: formatNoteResponse(updatedNote.toObject()),
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Delete an existing note
exports.deleteNotes = async (req, res, next) => {
  try {
    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid note ID.",
      });
    }

    const deletedNote = await notesModel.findOneAndDelete({
      _id: noteId,
      createdBy: req.user.email,
    });

    if (!deletedNote) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found or you don't have permission to delete this note.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Note deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Get all notes with formatted date/time
exports.getNotes = async (req, res, next) => {
  try {
    const queryObject = { ...req.query };
    delete queryObject.createdBy;
    queryObject.createdBy = req.user.email;

    const displayedNotes = await notesModel.find(queryObject).lean();

    const notesWithFormattedData = displayedNotes.map((note) =>
      formatNoteResponse(note)
    );

    res.status(200).json({
      status: "success",
      results: notesWithFormattedData.length,
      data: notesWithFormattedData,
    });
  } catch (err) {
    next(err);
  }
};
