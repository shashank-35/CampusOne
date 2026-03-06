const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

// Ensure upload directories exist
const dirs = ['courses', 'profiles', 'students', 'events', 'admissions'];
dirs.forEach((dir) => {
  const full = path.join(__dirname, '../../uploads', dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../../uploads/${folder}`));
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });

const docFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|xls|xlsx|ppt|pptx/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only document files are allowed (pdf, doc, docx, xls, xlsx, ppt, pptx)'));
  }
};

const imageFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|gif|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed (jpg, jpeg, png, gif, webp)'));
  }
};

// Document uploads (courses, student files)
const upload = multer({ storage: makeStorage('courses'), fileFilter: docFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Profile image upload
const uploadProfile = multer({ storage: makeStorage('profiles'), fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Student document upload
const uploadStudent = multer({ storage: makeStorage('students'), fileFilter: docFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Event poster upload
const uploadEvent = multer({ storage: makeStorage('events'), fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Admission document upload — accepts images (photo) and docs (idProof, marksheet)
const admissionFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = /jpg|jpeg|png|pdf|doc|docx/;
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only images (jpg, png) and documents (pdf, doc, docx) are allowed'));
  }
};
const uploadAdmission = multer({ storage: makeStorage('admissions'), fileFilter: admissionFileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { upload, uploadProfile, uploadStudent, uploadEvent, uploadAdmission };
