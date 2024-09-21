// controllers/notesController.js

const notesModel = require("../Models/notesModel"); // Ensure correct path
const mongoose = require('mongoose');

// Create a new note
exports.createNotes = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                status: "fail",
                message: "Title and content are required."
            });
        }

        // Create the note with 'createdBy' set to the user's _id
        const createdNote = await notesModel.create({
            title,
            content,
            createdBy: req.user.email // Use ObjectId
        });

        res.status(201).json({
            status: "success",
            data: createdNote
        });
    } catch (err) {
        next(err);
    }
};

// Update an existing note
exports.updateNotes = async (req, res, next) => {
    try {
        const noteId = req.params.id;

        // Validate noteId
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid note ID."
            });
        }

        // Prepare the update object
        const updateData = { ...req.body };

        // Prevent users from changing the 'createdBy' field
        if (updateData.createdBy) {
            delete updateData.createdBy;
        }

        // Find the note by ID and ensure it belongs to the user
        const updatedNote = await notesModel.findOneAndUpdate(
            { _id: noteId, createdBy: req.user.email }, // Ownership check
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({
                status: "fail",
                message: "Note not found or you don't have permission to edit this note."
            });
        }

        res.status(200).json({
            status: "success",
            data: updatedNote
        });

    } catch (err) {
        next(err);
    }
};

// Delete an existing note
exports.deleteNotes = async (req, res, next) => {
    try {
        const noteId = req.params.id;

        // Validate noteId
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid note ID."
            });
        }

        // Find the note by ID and ensure it belongs to the user
        const deletedNote = await notesModel.findOneAndDelete(
            { _id: noteId, createdBy: req.user.email } // Ownership check
        );

        if (!deletedNote) {
            return res.status(404).json({
                status: "fail",
                message: "Note not found or you don't have permission to delete this note."
            });
        }

        res.status(200).json({
            status: "success",
            message: "Note deleted successfully."
        });

    } catch (err) {
        next(err);
    }
};

// Get all notes for the logged-in user
exports.getNotes = async (req, res, next) => {
    try {
        // Construct the query object
        const queryObject = { ...req.query };

        // Remove any fields from queryObject that should not be queryable by the user
        delete queryObject.createdBy;

        // Add the 'createdBy' filter to ensure only user's notes are fetched
        queryObject.createdBy = req.user.email; // Use ObjectId

        // Optional: Implement additional filtering, sorting, pagination as needed
        const displayedNotes = await notesModel.find(queryObject);

        if (!displayedNotes || displayedNotes.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "No notes available."
            });
        }

        res.status(200).json({
            status: "success",
            results: displayedNotes.length,
            data: displayedNotes
        });

    } catch (err) {
        next(err);
    }
};
