exports.errorHandler = (err, req, res, next) => {
    // 1. Validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(el => el.message);

        return res.status(400).json({
            message: "Invalid data",
            errors,
        });
    }

    // 2. Cast error (invalid ID)
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID",
            error: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // 3. Duplicate field error (MongoDB unique constraint violation)
    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyPattern)[0];
        const duplicateValue = err.keyValue[duplicateField];

        return res.status(400).json({
            message: `Duplicate value '${duplicateValue}' for field '${duplicateField}'`,
        });
    }

    // 4. General internal server error (fallback)
    return res.status(500).json({
        message: "Fail",
        error: err.message || "Internal server error",
    });
};
