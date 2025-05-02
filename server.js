const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let veriler = [];

app.post('/api/issues', (req, res) => {
  const yeniVeri = {
    ...req.body,
    status: "Beklemede",
    createdAt: new Date().toISOString()
  };
  veriler.push(yeniVeri);
  console.log("📩 Yeni kayıt RAM'e alındı:", yeniVeri);
  res.status(201).json({ message: 'RAM\'e kayıt başarılı!' });
});

app.post('/api/update', (req, res) => {
  const updated = req.body;
  const index = veriler.findIndex(item => item.createdAt === updated.createdAt);
  if (index !== -1) {
    veriler[index] = updated;
    console.log("✅ Durum güncellendi:", updated);
    return res.status(200).json({ message: "Durum güncellendi!" });
  }
  res.status(404).json({ message: "Kayıt bulunamadı!" });
});


app.get('/api/issues', (req, res) => {
  res.json(veriler);
});

app.get('/', (req, res) => {
  res.send('🟢 RAM tabanlı Stockart API çalışıyor!');
});

app.listen(port, () => {
  console.log(`🟢 Sunucu aktif: http://localhost:${port}`);
});
