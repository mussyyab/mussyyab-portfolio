const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Global memory on server for world-wide messages
let globalInquiries = [];
let globalChats = [];

// 1. Client Form Message API
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  const newInquiry = {
    id: Date.now(),
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  globalInquiries.push(newInquiry);
  return res.json({ success: true, message: 'Saved on server' });
});

// 2. AI Assistant Chat Inquiries API
app.post('/api/chat-inquiry', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false });

  const newChat = {
    id: Date.now(),
    text,
    timestamp: new Date().toISOString()
  };

  globalChats.push(newChat);
  return res.json({ success: true });
});

// 3. Admin Panel Data Fetch API
app.get('/api/admin/data', (req, res) => {
  res.json({
    success: true,
    inquiries: globalInquiries,
    chats: globalChats
  });
});

// 4. Admin Clear Logs APIs
app.post('/api/admin/clear-inquiries', (req, res) => {
  globalInquiries = [];
  res.json({ success: true });
});

app.post('/api/admin/clear-chats', (req, res) => {
  globalChats = [];
  res.json({ success: true });
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});
