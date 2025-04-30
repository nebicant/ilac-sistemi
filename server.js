const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// MongoDB bağlantısı
mongoose.connect('mongodb://127.0.0.1:27017/ilacSistemi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB bağlantısı başarılı"))
.catch(err => console.error("MongoDB bağlantı hatası:", err));

// Model
const Issue = mongoose.model('Issue', {
  hospital: String,
  deviceType: String,
  issueType: [String],
  description: String,
  urgency: String,
  screenshot: String
});

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Form gönderim endpoint'i
app.post('/api/issues', upload.single('screenshot'), async (req, res) => {
  try {
    const issue = new Issue({
      hospital: req.body.hospital === "Diğer" ? req.body.otherHospital : req.body.hospital,
      deviceType: req.body.deviceType,
      issueType: Array.isArray(req.body.issueType) ? req.body.issueType : [req.body.issueType],
      description: req.body.description,
      urgency: req.body.urgency,
      screenshot: req.file ? req.file.path : null
    });

    await issue.save();
    res.send("Sorun başarıyla kaydedildi!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Kayıt sırasında hata oluştu: " + err.message);
  }
});

// Sunucuyu başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor...`);
});
