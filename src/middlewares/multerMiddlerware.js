import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.join("/tmp", "uploads", "profileImages");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  }); 
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); 
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(
    file.mimetype
  );

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPEG, JPG, and PNG files are allowed!"
      )
    );
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
