let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    fetchTimeline();
    setupContactForm();
});

// Projects Loader
async function fetchProjects() {
    const grid = document.getElementById('projectGrid');
    try {
        const res = await fetch('/api/projects');
        allProjects = await res.json();
        renderProjects(allProjects);
    } catch (e) {
        if (grid) grid.innerHTML = '<p class="text-rose-400 text-xs col-span-2 text-center py-6">Failed to load projects from database.</p>';
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;
    if (!projects.length) {
        grid.innerHTML = '<p class="text-slate-400 text-xs col-span-2 text-center py-8">No projects found in database.</p>';
        return;
    }

    grid.innerHTML = projects.map(p => {
        const isAi = p.category === 'ai';
        const badgeColor = isAi ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        const buttonColor = isAi ? 'text-indigo-400 hover:text-indigo-300' : 'text-emerald-400 hover:text-emerald-300';
        const subBadgeColor = isAi ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300';
        const tagsHtml = (p.tags || []).map(t => `<span class="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">${t}</span>`).join('');

        return `
        <div class="project-item glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between" data-category="${p.category}">
            <div>
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeColor}">
                        ${p.category === 'ai' ? 'Generative AI / SaaS' : 'Database & Management'}
                    </span>
                    <span class="text-[10px] ${subBadgeColor} px-2 py-0.5 rounded-full font-semibold">
                        ${p.badge || 'Live Tool'}
                    </span>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">${p.title}</h3>
                <p class="text-xs text-slate-300 leading-relaxed mb-4">${p.description}</p>
                ${p.solution ? `
                <div class="space-y-1.5 mb-4 text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div><strong class="text-slate-200">How I Solved It:</strong> ${p.solution}</div>
                </div>` : ''}
            </div>
            <div>
                <div class="flex flex-wrap gap-1.5 mb-5">${tagsHtml}</div>
                <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <a href="${p.liveUrl}" target="_blank" class="text-xs font-bold ${buttonColor} transition flex items-center gap-1.5 group">
                        <span>${p.buttonText || 'Launch Live Demo'}</span>
                        <span class="group-hover:translate-x-1 transition-transform">⚡</span>
                    </a>
                    <a href="#contact" class="text-xs text-slate-400 hover:text-white transition">Hire Me →</a>
                </div>
            </div>
        </div>`;
    }).join('');
}

// Timeline Loader
async function fetchTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    try {
        const res = await fetch('/api/timeline');
        const items = await res.json();
        
        if (!items || !items.length) {
            container.innerHTML = `
                <div class="relative pl-8 pb-8 border-l border-indigo-500/30">
                    <div class="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#090d16] border-2 border-indigo-500"></div>
                    <div class="glass-card p-5 rounded-2xl border border-slate-800">
                        <span class="text-xs font-bold text-indigo-400">2024 — 2028</span>
                        <h4 class="text-base font-bold text-white mt-1">Bachelor of Science in Computer Science (BSCS)</h4>
                        <p class="text-xs text-slate-400 mb-2">Government College University Faisalabad (GCUF)</p>
                        <p class="text-xs text-slate-300">Focused on Data Structures, Web Architectures, and Database Systems.</p>
                    </div>
                </div>
                <div class="relative pl-8 border-l border-indigo-500/30">
                    <div class="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#090d16] border-2 border-emerald-500"></div>
                    <div class="glass-card p-5 rounded-2xl border border-slate-800">
                        <span class="text-xs font-bold text-emerald-400">Hands-on Experience</span>
                        <h4 class="text-base font-bold text-white mt-1">1 Year Core Experience in Web Development</h4>
                        <p class="text-xs text-slate-400 mb-2">Full-Stack Web Architectures & Database Systems</p>
                        <p class="text-xs text-slate-300">Engineered live systems with Node.js, Express, MongoDB, and Tailwind CSS.</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="relative pl-8 pb-8 border-l border-indigo-500/30 last:pb-0">
                <div class="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#090d16] border-2 border-indigo-500"></div>
                <div class="glass-card p-5 rounded-2xl border border-slate-800">
                    <div class="flex items-center justify-between gap-2 mb-1">
                        <span class="text-xs font-bold text-indigo-400">${item.year}</span>
                        <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">${item.type}</span>
                    </div>
                    <h4 class="text-base font-bold text-white">${item.role}</h4>
                    <p class="text-xs font-medium text-slate-400 mb-2">${item.company}</p>
                    <p class="text-xs text-slate-300 leading-relaxed">${item.description}</p>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Timeline error:', e);
    }
}

// Intent Filter Buttons
function filterProjects(category) {
    document.querySelectorAll('.guide-btn').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('border-indigo-500', 'active');
            btn.classList.remove('border-slate-800');
        } else {
            btn.classList.remove('border-indigo-500', 'active');
            btn.classList.add('border-slate-800');
        }
    });

    if (category === 'all') {
        renderProjects(allProjects);
    } else {
        renderProjects(allProjects.filter(p => p.category === category));
    }
}

// AI Drawer Toggle
function toggleAiDrawer() {
    const drawer = document.getElementById('aiDrawer');
    if (drawer) {
        drawer.classList.toggle('translate-x-full');
    }
}

// ==========================================
// CLIENT CONVERSION AI ENGINE
// ==========================================

function generateAiResponse(input) {
    const raw = input.trim();
    const clean = raw.toLowerCase();
    const hasWord = (regexStr) => new RegExp(`\\b(${regexStr})\\b`, 'i').test(clean);

    // 1. Who is Mussyyab
    if (hasWord("who|who's|whats|what is|konsa|koun|kaun|intro|about") && clean.includes("mussyyab")) {
        return `**Mussyyab Tariq** is a dedicated Full-Stack Software Engineer & AI Solutions Architect.\n\nHe specializes in converting business concepts into scalable web applications, robust database platforms, and custom AI workflows. Rather than using generic templates, he engineers high-performance architectures with clean code, modern UX, and robust backends.\n\nAre you looking to build a new product or hire him for a project?`;
    }

    // 2. Direct Experience Question
    if (hasWord("experience|tajruba|background|history|kaam kitna kiya|work experience|exp")) {
        return `### 💼 Engineering Experience\n\nMussyyab brings **1+ Years of Core Hands-on Experience** developing and deploying production-grade full-stack systems.\n\n* **Production Deployments:** Architected live platforms like **HirePulse AI** (Vector/LLM engine) and **School ERP Attendance System** (Data-driven ledger engine).\n* **Core Technical Stack:** Node.js, Express, MongoDB, PostgreSQL, RESTful APIs, and Tailwind CSS.\n* **Engineering Philosophy:** Clean schema modeling, microsecond query optimization, and zero bloat.\n\nWould you like to review one of his live case studies or discuss a project of your own?`;
    }

    // 3. Direct Education Question
    if (hasWord("education|degree|qualification|university|college|parhai|study|gcuf|bscs")) {
        return `### 🎓 Academic Background\n\n* **Degree:** Bachelor of Science in Computer Science (**BSCS**)\n* **Institution:** Government College University Faisalabad (**GCUF**)\n* **Core Focus Areas:** Data Structures & Algorithms (DSA), Relational & NoSQL Database Architectures, and Modern Software Engineering Principles.\n\nHis technical strength comes from solid computer science fundamentals paired with continuous real-world project execution.`;
    }

    // 4. Greetings
    if (hasWord("salam|assalam|slaam|asalam")) {
        return `**Walaikum Assalam wa Rahmatullahi wa Barakatuh!** 🌟\n\nWelcome! I am Mussyyab's AI Consultant. I'm here to explore your software needs, share technical architecture blueprints, and help you collaborate directly with Mussyyab.\n\nWhat kind of digital product or workflow are you planning to develop?`;
    }

    if (hasWord("hi|hello|helo|hey|yo|hlo|hy")) {
        return `**Hello! Great to connect with you.** 👋\n\nI'm Mussyyab's AI representative. We help founders and businesses build high-performance web applications, AI tools, and scalable database portals.\n\nCould you share a brief idea of what you are looking to build today?`;
    }

    // 5. Politeness
    if (hasWord("how are you|kaise ho|kese ho|kya hal|kia haal|how r u|sub kheriat")) {
        return `**Alhamdulillah, I am doing great!** Thank you for asking. 🚀\n\nMussyyab is actively architecting scalable software solutions for clients. Tell me about your requirements—are you starting an MVP from scratch or upgrading an existing platform?`;
    }

    // 6. Pricing & Estimates
    if (hasWord("price|cost|budget|rate|paisa|kitna|charges|quote|fee")) {
        return `### 💼 Transparent & Milestone-Based Pricing\n\nMussyyab structures project investments around defined deliverables:\n\n* **No Hidden Surprises:** Clear roadmap with milestone-based signoffs—you review working features before release.\n* **Fair Market Quotes:** Pricing reflects database architecture, custom integrations, and scale.\n\nDrop your estimated scope via the **Get In Touch** form below so Mussyyab can provide an exact timeline and estimate!`;
    }

    // 7. Domain Inquiries

    // AI & Automation
    if (hasWord("ai|ats|llm|gpt|vector|openai|claude|gemini|embeddings|resume")) {
        return `### 🤖 AI Engineering & Smart Workflows\n\nThis is one of Mussyyab's strongest core domains.\n\n**Mussyyab's Proven Work in this Field:**\nHe previously engineered **HirePulse AI**, an advanced platform that replaces standard keyword matching with **Semantic Vector Embeddings** and LLM intelligence to score profiles and auto-generate optimized content.\n\n**To tailor this precisely for you, could you specify:**\n1. What specific task will your AI system perform?\n2. What is your expected user load or data input format?\n\nOnce you share this, Mussyyab can structure the complete API and database pipeline for you!`;
    }

    // Portals & School Management
    if (hasWord("school|erp|attendance|portal|management|crm|ledger|database|admin panel")) {
        return `### 📊 Enterprise Management & Custom Portals\n\nOperational workflows require absolute data integrity and clean permission models.\n\n**Mussyyab's Proven Work in this Field:**\nHe developed the **School Management & ERP Attendance System**—a full institutional platform managing student records, attendance ledgers, and formal automated report generation with zero data anomalies.\n\n**To help scope your project:**\n1. What user roles do you require (e.g., Admin, Staff, Client)?\n2. What are the key reports or operations you need automated?\n\nMussyyab can design an airtight schema specifically for your workflow.`;
    }

    // E-Commerce
    if (hasWord("shop|ecommerce|e-commerce|store|cart|products|selling|buy")) {
        return `### 🛍️ Bespoke High-Speed E-Commerce\n\nMussyyab builds custom e-commerce engines tailored for high conversion, lightning-fast loads, and secure checkouts without bloated plugins.\n\n**Key Capabilities:**\nCustom product filtering, cart persistence, automated order notifications, and payment processing pipelines.\n\n**Could you share:**\n1. Approximately how many products or categories will you launch with?\n2. Do you have a specific payment gateway preference?\n\nMussyyab will map out the complete architectural blueprint for you!`;
    }

    // 8. General Project Discussion
    return `### 💡 Let's Break Down Your Project\n\nI understand your idea: *"**${escapeHtml(raw)}**"*\n\nMussyyab has practical experience building end-to-end applications with **Node.js, Express, MongoDB, and modern reactive frontends** that run fast and scale easily.\n\n**To guide you accurately:**\n* What is the main goal of this system?\n* Do you need database storage, authentication, or third-party integrations?\n\nShare these details here, or submit the **Get In Touch** form below to set up a direct discovery call with Mussyyab!`;
}

function sendAiMessage() {
    const input = document.getElementById('aiUserInput');
    const msgBox = document.getElementById('chatMessages');
    const text = input.value.trim();
    if (!text) return;

    // User message
    msgBox.innerHTML += `
        <div class="flex justify-end mb-3">
            <div class="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-xs leading-relaxed shadow-md break-words">
                ${escapeHtml(text)}
            </div>
        </div>
    `;
    input.value = '';
    msgBox.scrollTop = msgBox.scrollHeight;

    // Typing dots
    const typingId = 'typing-' + Date.now();
    msgBox.innerHTML += `
        <div id="${typingId}" class="flex items-start gap-2 mb-3">
            <div class="h-6 w-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-bold shrink-0">AI</div>
            <div class="bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span class="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                <span class="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span class="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
        </div>
    `;
    msgBox.scrollTop = msgBox.scrollHeight;

    // Response render
    setTimeout(() => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        const rawReply = generateAiResponse(text);
        const parsedReply = formatMarkdown(rawReply);

        msgBox.innerHTML += `
            <div class="flex items-start gap-2 mb-3">
                <div class="h-6 w-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-bold shrink-0">AI</div>
                <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] text-xs text-slate-200 leading-relaxed shadow-lg">
                    ${parsedReply}
                </div>
            </div>
        `;
        msgBox.scrollTop = msgBox.scrollHeight;
    }, 500);
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatMarkdown(text) {
    return text
        .replace(/### (.*?)\n/g, '<div class="text-sm font-bold text-white mb-2 flex items-center gap-1.5">$1</div>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300 font-semibold">$1</strong>')
        .replace(/\* (.*?)\n/g, '<div class="flex items-start gap-2 my-1 text-slate-300"><span class="text-indigo-400">▹</span><span>$1</span></div>')
        .replace(/\n\n/g, '<div class="my-2"></div>')
        .replace(/\n/g, '<br>');
}

// Contact Form Handler
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        const payload = {
            name: document.getElementById('senderName').value,
            email: document.getElementById('senderEmail').value,
            scope: document.getElementById('projectScope').value
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert('✅ Shukriya! Aapka message database mein save ho gaya hai. Mussyyab jald aapse rabta karenge.');
                form.reset();
            } else {
                alert('Failed to send inquiry.');
            }
        } catch (err) {
            alert('Server error.');
        } finally {
            submitBtn.innerText = 'Send Project Inquiry ✉️';
            submitBtn.disabled = false;
        }
    });
}