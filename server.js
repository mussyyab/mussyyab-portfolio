require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Project = require('./models/project');
const Inquiry = require('./models/inquiry');
const Timeline = require('./models/timeline');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mussyyab123';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mussyyab_portfolio';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Database Connected Successfully!');
    await seedInitialData();
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

async function seedInitialData() {
  try {
    const pCount = await Project.countDocuments();
    if (pCount === 0) {
      await Project.create([
        {
          title: 'HirePulse AI — Career Intelligence Platform',
          category: 'ai',
          badge: 'Live Tool',
          description: 'Next-generation career optimization tool using semantic embeddings and LLMs to evaluate resume match rate, highlight missing skills, and rewrite weak bullet points.',
          solution: 'Replaced regex keyword scans with semantic vector similarity.',
          tags: ['FastAPI', 'Gemini API', 'PostgreSQL'],
          liveUrl: 'https://musyyab-resume-studio.netlify.app/',
          buttonText: 'Launch Live Resume Tool'
        },
        {
          title: 'School Management & ERP Attendance System',
          category: 'management',
          badge: 'Live System',
          description: 'Comprehensive institutional management platform engineered to automate student records, attendance tracking (P/A/L), monthly ledgers, and formal Principal reports.',
          solution: 'Dynamic client-side ledger engine with persistent storage and report generation.',
          tags: ['Tailwind CSS', 'JavaScript ES6', 'Attendance Engine'],
          liveUrl: 'https://mussyyab-attendancetool.netlify.app',
          buttonText: 'Launch Live Attendance Tool'
        }
      ]);
      console.log('✅ Default projects seeded!');
    }

    const tCount = await Timeline.countDocuments();
    if (tCount === 0) {
      await Timeline.create([
        {
          year: '2024 — Present',
          role: 'Full-Stack Software Engineer & AI Builder',
          company: 'Independent / SaaS Projects',
          description: 'Architecting HirePulse AI & institutional ERPs. Designing scalable relational and document datastores, RESTful endpoints, and responsive frontends.',
          type: 'work'
        },
        {
          year: '2022 — 2026',
          role: 'BS Computer Science',
          company: 'University Education',
          description: 'Core focus on Data Structures & Algorithms, Database Systems (SQL & NoSQL), Distributed Computing, and Software Architecture.',
          type: 'education'
        }
      ]);
      console.log('✅ Default timeline seeded!');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// --- API ROUTES ---

// 1. Projects
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const { adminPassword, title, category, badge, description, solution, tags, liveUrl, buttonText } = req.body;
  if (adminPassword !== ADMIN_PASSWORD && adminPassword !== 'mussyyab123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const newP = new Project({
    title, category, badge, description, solution,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
    liveUrl, buttonText
  });
  await newP.save();
  res.status(201).json(newP);
});

app.delete('/api/projects/:id', async (req, res) => {
  const { adminPassword } = req.body;
  if (adminPassword !== ADMIN_PASSWORD && adminPassword !== 'mussyyab123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// 2. Timeline
app.get('/api/timeline', async (req, res) => {
  const timeline = await Timeline.find().sort({ createdAt: -1 });
  res.json(timeline);
});

app.post('/api/timeline', async (req, res) => {
  const { adminPassword, year, role, company, description, type } = req.body;
  if (adminPassword !== ADMIN_PASSWORD && adminPassword !== 'mussyyab123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const item = new Timeline({ year, role, company, description, type });
  await item.save();
  res.status(201).json(item);
});

app.delete('/api/timeline/:id', async (req, res) => {
  const { adminPassword } = req.body;
  if (adminPassword !== ADMIN_PASSWORD && adminPassword !== 'mussyyab123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await Timeline.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// 3. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD || password === 'mussyyab123') {
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Invalid password' });
});

// 4. Inquiries
app.post('/api/contact', async (req, res) => {
  const inquiry = new Inquiry(req.body);
  await inquiry.save();
  res.status(201).json({ success: true });
});

app.get('/api/inquiries', async (req, res) => {
  const pass = req.headers['x-admin-password'];
  if (pass !== ADMIN_PASSWORD && pass !== 'mussyyab123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));