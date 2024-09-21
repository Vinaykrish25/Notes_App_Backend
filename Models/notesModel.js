const mongoose = require('mongoose');

// Function to get the current date (YYYY-MM-DD)
const getCurrentDate = () => {
    const today = new Date();
    const localDate = new Date(today.toLocaleDateString('en-CA')); // Format as YYYY-MM-DD
    return localDate;
};

// Function to get the current time in HH:MM AM/PM format
const getCurrentTime = () => {
    const today = new Date();
    let hours = today.getHours();
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 hour to 12
    return `${hours}:${minutes} ${ampm}`;
};

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: [10, "Title length should not exceed 10 characters"],
        default: "Empty Title",
    },
    content: {
        type: String,
        required: [true, "Not allowed to create an empty note"],
    },
    createdDate: {
        type: Date,
        default: getCurrentDate, // Automatically assigns current date
        get: function (v) {
            return v.toISOString().split('T')[0]; // Returns only the date part (YYYY-MM-DD)
        }
    },
    createdTime: {
        type: String,
        default: getCurrentTime, // Automatically assigns current time
        validate: {
            validator: function (v) {
                return /^\d{1,2}:\d{2} (AM|PM)$/.test(v); // Validates the time format
            },
            message: props => `${props.value} is not a valid time format (HH:MM AM/PM)!`,
        },
    },
    updatedDate: {
        type: Date,
        default: getCurrentDate, // Automatically assigns current date
        get: function (v) {
            return v.toISOString().split('T')[0]; // Returns only the date part (YYYY-MM-DD)
        }
    },
    updatedTime: {
        type: String,
        default: getCurrentTime, // Automatically assigns current time
        validate: {
            validator: function (v) {
                return /^\d{1,2}:\d{2} (AM|PM)$/.test(v); // Validates the time format
            },
            message: props => `${props.value} is not a valid time format (HH:MM AM/PM)!`,
        },
    },
    createdBy: {
        type: String,
        ref: 'User',
        required: [true, 'A note must have an owner']
    }
}, { 
    collection: "notes", 
    toObject: { getters: true }, 
    toJSON: { getters: true } 
});

// Pre-save middleware to update `updatedDate` and `updatedTime` on document modification
notesSchema.pre('save', function (next) {
    if (!this.isNew && this.isModified()) {
        this.updatedDate = getCurrentDate();
        this.updatedTime = getCurrentTime();
    }
    next();
});

// Pre 'findOneAndUpdate' middleware to update `updatedDate` and `updatedTime` on query updates
notesSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update) {
        // If the update is using $set, modify the $set object
        if (update.$set) {
            update.$set.updatedDate = getCurrentDate();
            update.$set.updatedTime = getCurrentTime();
        } else {
            // Otherwise, directly set the fields
            update.updatedDate = getCurrentDate();
            update.updatedTime = getCurrentTime();
        }
    }

    next();
});

const notesModel = mongoose.model('Note', notesSchema);

module.exports = notesModel;
