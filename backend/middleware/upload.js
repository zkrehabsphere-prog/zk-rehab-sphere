const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// ─── Shared Memory Storage (Vercel-Compatible) ────────────────────────────────
const storage = multer.memoryStorage();


// ─── File Type Filters ─────────────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, png, webp) are allowed.'));
};

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) {
    return cb(null, true);
  }
  cb(new Error('Only PDF and image files are allowed.'));
};

// ─── Multer Instances ──────────────────────────────────────────────────────────
const uploadExpertImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

const uploadResource = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for PDFs
  fileFilter,
});

const uploadBlogImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for blog images
  fileFilter: imageFilter,
});


// ─── Helper: delete old file ───────────────────────────────────────────────────
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
};

// ─── Base64 Helper (for MongoDB storage) ──────────────────────────────────────
const bufferToBase64 = (file) => {
  if (!file) return null;
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
};

module.exports = {
  uploadExpertImage,
  uploadResource,
  uploadBlogImage,
  deleteFile,
  bufferToBase64,
  uploadToCloudinary,
};

// ─── Cloudinary Upload Helper ──────────────────────────────────────────────────
async function uploadToCloudinary(buffer, folderPath, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath || 'zk-rehab-blogs',
        public_id: filename || `image-${Date.now()}`,
        resource_type: 'auto',
        quality: 'auto',
        format: 'webp',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

