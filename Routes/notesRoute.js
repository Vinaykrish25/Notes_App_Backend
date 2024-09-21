const express = require('express');
const { createNotes, updateNotes, deleteNotes, getNotes } = require('../Controllers/notesController');
const { protect } = require('../Middlewares/authHandler')
const notesRouter = express.Router();

notesRouter.post('/', createNotes);
notesRouter.patch('/:id', updateNotes);
notesRouter.delete('/:id', deleteNotes);
notesRouter.get('/', getNotes);

module.exports = notesRouter;