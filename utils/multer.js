const multer = require('multer');
const shortId = require('shortid');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${shortId.generate()}_${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb("تنها پسوند JPEG پشتیبانی میشود", false);
    }
};

module.exports = {
    storage,
    fileFilter
}