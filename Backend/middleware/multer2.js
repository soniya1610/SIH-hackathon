const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    console.log("=================================");
    console.log("FILE RECEIVED");
    console.log("Original name:", file.originalname);
    console.log("MIME type:", file.mimetype);
    console.log("Field name:", file.fieldname);
    console.log("=================================");

    // Temporarily accept all files
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

module.exports = upload;