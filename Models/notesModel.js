const mongoose = require('mongoose');

// ✅ Format local date as YYYY-MM-DD (India timezone)
const formatLocalDate = (date) => {
    return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Kolkata',
    }).format(date);
};

// ✅ Format local time as HH:MM AM/PM (India timezone)
const formatLocalTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    }).format(date);
};

// ✅ Return current local date
const getCurrentDate = () => {
    return new Date(); // We'll format it using getters
};

// ✅ Return current local time
const getCurrentTime = () => {
    return formatLocalTime(new Date());
};

const notesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            maxlength: [10, "Title length should not exceed 10 characters"],
            unique: true,
        },
        content: {
            type: String,
            required: [true, "Not allowed to create an empty note"],
        },
        createdDate: {
            type: Date,
            default: getCurrentDate,
            get: (v) => formatLocalDate(v),
        },
        createdTime: {
            type: String,
            default: getCurrentTime,
            validate: {
                validator: (v) => /^\d{1,2}:\d{2} (AM|PM)$/.test(v),
                message: (props) =>
                    `${props.value} is not a valid time format (HH:MM AM/PM)!`,
            },
        },
        updatedDate: {
            type: Date,
            default: getCurrentDate,
            get: (v) => formatLocalDate(v),
        },
        updatedTime: {
            type: String,
            default: getCurrentTime,
            validate: {
                validator: (v) => /^\d{1,2}:\d{2} (AM|PM)$/.test(v),
                message: (props) =>
                    `${props.value} is not a valid time format (HH:MM AM/PM)!`,
            },
        },
        createdBy: {
            type: String,
            ref: 'User',
            required: [true, 'A note must have an owner'],
        },
    },
    {
        collection: "notes",
        toObject: { getters: true },
        toJSON: { getters: true }, // ✅ ensures getters are applied in JSON response
    }
);

// ✅ Auto-update updatedDate/Time when modified
notesSchema.pre('save', function (next) {
    if (!this.isNew && this.isModified()) {
        this.updatedDate = getCurrentDate();
        this.updatedTime = getCurrentTime();
    }
    next();
});

notesSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update) {
        const now = new Date();
        const formattedTime = formatLocalTime(now);

        if (update.$set) {
            update.$set.updatedDate = now;
            update.$set.updatedTime = formattedTime;
        } else {
            update.updatedDate = now;
            update.updatedTime = formattedTime;
        }
    }

    next();
});

const notesModel = mongoose.model('Note', notesSchema);

module.exports = notesModel;
