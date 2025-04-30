const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const filePath = path.join(__dirname, 'veriler.json');

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]');
}

app.post('/api/issues', (req, res) => {
  const yeniVeri = req.body;
  const mevcutVeriler = JSON.parse(fs.readFileSync(filePath));
  mevcutVeriler.push(yeniVeri);
  fs.writeFileSync(filePath, JSON.stringify(mevcutVeriler, null, 2));
  res.status(201).json({ message: 'Kayıt başarıyla alındı!' });
});

app.get('/api/issues', (req, res) => {
  const veriler = JSON.parse(fs.readFileSync(filePath));
  res.json(veriler);
});

app.get('/', (req, res) => {
  res.send('🟢 JSON tabanlı Stockart API aktif!');
});

app.listen(port, () => {
  console.log(`🟢 Sunucu çalışıyor: http://localhost:${port}`);
});