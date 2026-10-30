const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // temporary storage we will not store file permanently
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },
});

module.exports = upload;
