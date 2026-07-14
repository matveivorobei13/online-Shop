const multer = require("multer")
const path = require("path")


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isValidExt = allowedTypes.test(ext);
  const isValidMime = allowedTypes.test(mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },



  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

function fileMiddleware(req, res, next){
    if(!req.file){
        return res.json({status: "error", message: "file was not added"})
    }
    next()
}


const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },

  fileFilter
});

module.exports = {
    fileMiddleware,
    upload
}
