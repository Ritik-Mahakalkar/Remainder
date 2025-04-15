const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789', 
  database: 'remainder_database'
});

db.connect(err => {
  if (err) {
    console.error(' MySQL connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Create 
app.post('/reminders', (req, res) => {
  const { user_id, title, description, date } = req.body;
  const sql = 'INSERT INTO reminders (user_id, title, description, date) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id, title, description, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Reminder created', id: result.insertId });
  });
});

// Fetch 
app.get('/reminders/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const sql = 'SELECT * FROM reminders WHERE user_id = ? ORDER BY date ASC';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Delete 
app.delete('/reminders/:id', (req, res) => {
  const reminderId = req.params.id;
  const sql = 'DELETE FROM reminders WHERE id = ?';
  db.query(sql, [reminderId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
