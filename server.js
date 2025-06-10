const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const dbPath = path.join(__dirname, 'database.json');
app.use(express.json());
app.use(express.static('public'));

app.post('/api/save', (req, res) => {
  const { number, role } = req.body;
  if (!number || !role) return res.status(400).json({ success: false });

  const newEntry = {
    number,
    role,
    timestamp: new Date().toLocaleString()
  };

  let data = [];
  if (fs.existsSync(dbPath)) {
    const raw = fs.readFileSync(dbPath);
    try { data = JSON.parse(raw); } catch {}
  }

  data.push(newEntry);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.get('/api/entries', (req, res) => {
  if (!fs.existsSync(dbPath)) return res.json([]);
  const raw = fs.readFileSync(dbPath);
  try { res.json(JSON.parse(raw)); } catch { res.json([]); }
});

app.listen(PORT, () => {
  console.log('LYLIA-PANEL running on http://localhost:' + PORT);
});
