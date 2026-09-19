// Universal 3D Background Engine & Global Interactivity
document.addEventListener('DOMContentLoaded', () => {
  // 1. Three.js Wireframe Sphere Visualization
  const canvas = document.getElementById('bg-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.IcosahedronGeometry(2.4, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Subtle floating point particles
    const particlesGeo = new THREE.BufferGeometry();
    const count = 120;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 14;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.4
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    camera.position.z = 4.2;

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.0015;
      sphere.rotation.x += 0.0008;

      sphere.rotation.y += (mouseX - sphere.rotation.y) * 0.03;
      sphere.rotation.x += (-mouseY - sphere.rotation.x) * 0.03;

      particlesMesh.rotation.y -= 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // 2. Glass Cards Mouse Tilt Effect
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y * 0.02}deg) rotateY(${x * 0.02}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 3. Inject Left-Sided Global Chatbot Automatically on Every Page
  injectGlobalChatbot();
});

function injectGlobalChatbot() {
  if (document.getElementById('globalChatToggler')) return;

  // Create Modern Pill Trigger Button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'globalChatToggler';
  toggleBtn.className = 'chatbot-toggler-left';
  toggleBtn.innerHTML = `
    <span class="bot-pulse"></span>
    <i data-lucide="bot" style="width: 18px; height: 18px; color: var(--accent-cyan);"></i>
    <span style="font-size: 0.86rem; font-weight: 600; letter-spacing: 0.2px;">Ask Assistant</span>
  `;

  // Create Chat Window Element
  const chatWin = document.createElement('div');
  chatWin.id = 'globalChatWindow';
  chatWin.className = 'chatbot-window-left';
  chatWin.innerHTML = `
    <div class="chat-header-custom">
      <div style="display: flex; align-items: center; gap: 8px;">
        <i data-lucide="sparkles" style="width: 16px; height: 16px; color: var(--accent-cyan);"></i>
        <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Mussyyab AI</h4>
      </div>
      <button class="chat-close-btn-custom" id="globalChatClose"><i data-lucide="x" style="width: 18px; height: 18px;"></i></button>
    </div>
    <div class="chat-body-custom" id="globalChatBody">
      <div class="chat-msg-custom chat-bot-custom">
        Hi there! I am Mussyyab's virtual assistant. Ask me about pricing, services, tech stack, or timelines!
      </div>
    </div>
    <div class="chat-footer-custom">
      <input type="text" id="globalChatInput" class="chat-input-custom" placeholder="Ask a question...">
      <button id="globalChatSend" class="chat-send-btn-custom"><i data-lucide="send" style="width: 14px; height: 14px;"></i></button>
    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(chatWin);

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Bind Events
  const chatInput = document.getElementById('globalChatInput');
  const chatBody = document.getElementById('globalChatBody');
  const sendBtn = document.getElementById('globalChatSend');
  const closeBtn = document.getElementById('globalChatClose');

  toggleBtn.addEventListener('click', () => {
    chatWin.classList.toggle('active');
    if (chatWin.classList.contains('active')) {
      chatInput.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWin.classList.remove('active');
  });

  function addMsg(text, isUser) {
    const d = document.createElement('div');
    d.className = `chat-msg-custom ${isUser ? 'chat-user-custom' : 'chat-bot-custom'}`;
    d.innerText = text;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getClientResponse(raw) {
    const q = raw.toLowerCase().trim();

    if (q.match(/^(hi|hello|hey|salam|aoa|hola)/)) {
      return "Hello! How can I assist you with your project requirements today?";
    }
    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('budget') || q.includes('charges') || q.includes('kitne')) {
      return "Pricing depends strictly on your project scope and database requirements. Mussyyab offers both milestone-based contracts and fixed project rates. Drop a message via the Connect page for an exact quote!";
    }
    if (q.includes('time') || q.includes('duration') || q.includes('deadline') || q.includes('delivery') || q.includes('fast')) {
      return "Standard web applications typically take 3 to 7 business days, while full-stack systems with custom databases and dashboards take 2 to 4 weeks.";
    }
    if (q.includes('service') || q.includes('offer') || q.includes('build') || q.includes('kya karte')) {
      return "Mussyyab provides end-to-end full-stack development: RESTful APIs, Node.js/Express backends, MongoDB schemas, and responsive WebGL frontend interfaces.";
    }
    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language')) {
      return "Core Stack: Node.js, Express, MongoDB Atlas, JavaScript (ES6+), React.js, HTML5/CSS3, REST APIs, Git/GitHub, and C++.";
    }
    if (q.includes('project') || q.includes('work') || q.includes('sample') || q.includes('demo')) {
      return "You can check completed projects on the Projects page, including the production Cloud Web Application and upcoming web platforms.";
    }
    if (q.includes('education') || q.includes('uni') || q.includes('degree') || q.includes('gcuf')) {
      return "Mussyyab is studying BS Computer Science at Government College University Faisalabad (GCUF, 2024–2028).";
    }
    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach')) {
      return "You can email directly at mussyyab447@gmail.com or submit your inquiry through the Connect page form!";
    }
    return "Thank you for asking! You can explore the Projects page for practical builds or submit an inquiry directly via the Connect tab.";
  }

  function handleSend() {
    const val = chatInput.value.trim();
    if (!val) return;
    addMsg(val, true);
    chatInput.value = '';

    setTimeout(() => {
      const rep = getClientResponse(val);
      addMsg(rep, false);
    }, 350);
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}