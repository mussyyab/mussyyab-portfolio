require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Global in-memory storage (admin panel aur instant live sync ke liye)
let globalInquiries = [];
let globalChats = [];

// Optional MongoDB Connection
let Inquiry = null;
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
  try {
    Inquiry = require('./models/inquiry');
  } catch(e) {}
}

// 1. Contact Inquiry API Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const inquiryObj = {
      id: Date.now(),
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    // Server memory mein save karein
    globalInquiries.push(inquiryObj);

    // Agar MongoDB connected ho toh wahan bhi save karein
    if (Inquiry) {
      try {
        const newInquiry = new Inquiry({ name, email, message });
        await newInquiry.save();
      } catch (dbErr) {
        console.log('MongoDB save note:', dbErr.message);
      }
    }

    res.status(201).json({ success: true, message: 'Inquiry saved successfully.' });
  } catch (error) {
    console.error('Inquiry Save Error:', error);
    res.status(500).json({ success: false, error: 'Server error saving inquiry.' });
  }
});

// 2. AI Chat Inquiry API Route
app.post('/api/chat-inquiry', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false });

  const chatObj = {
    id: Date.now(),
    text,
    timestamp: new Date().toISOString()
  };

  globalChats.push(chatObj);
  res.json({ success: true });
});

// 3. Admin Panel Data Endpoint
app.get('/api/admin/data', (req, res) => {
  res.json({
    success: true,
    inquiries: globalInquiries,
    chats: globalChats
  });
});

// 4. Admin Clear Endpoints
app.post('/api/admin/clear-inquiries', (req, res) => {
  globalInquiries = [];
  res.json({ success: true });
});

app.post('/api/admin/clear-chats', (req, res) => {
  globalChats = [];
  res.json({ success: true });
});

// Explicit Page Routes for Live Apps (Home par wapas bhejne se bachane ke liye)
app.get('/task-matrix.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'task-matrix.html'));
});

app.get('/cloud-calculator.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cloud-calculator.html'));
});

app.get('/resume-app.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resume-app.html'));
});

app.get('/attendance-app.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'attendance-app.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/projects.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Fallback Route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
