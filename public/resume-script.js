function bindSync(inputId, previewId, fallbackText) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (input && preview) {
    input.addEventListener('input', () => {
      preview.innerText = input.value.trim() !== '' ? input.value : fallbackText;
    });
  }
}

bindSync('inputName', 'previewName', 'MUSSYYAB TARIQ');
bindSync('inputTitle', 'previewTitle', 'Computer Science Undergraduate');
bindSync('inputEmail', 'previewEmail', 'mussyyabtariq@gmail.com');
bindSync('inputSummary', 'previewSummary', '');
bindSync('inputDegree', 'previewDegree', '');
bindSync('inputInstitute', 'previewInstitute', '');
bindSync('inputProjectTitle', 'previewProjectTitle', '');
bindSync('inputProjectDesc', 'previewProjectDesc', '');

function bindOptionalField(inputId, wrapId, textId) {
  const input = document.getElementById(inputId);
  const wrap = document.getElementById(wrapId);
  const text = document.getElementById(textId);

  if (input && wrap && text) {
    function update() {
      const val = input.value.trim();
      if (val === '') {
        wrap.style.display = 'none';
      } else {
        wrap.style.display = 'inline';
        text.innerText = val;
      }
    }
    input.addEventListener('input', update);
    update();
  }
}

bindOptionalField('inputLocation', 'previewLocationWrap', 'previewLocation');
bindOptionalField('inputPhone', 'previewPhoneWrap', 'previewPhone');
bindOptionalField('inputEmail', 'previewEmailWrap', 'previewEmail');
bindOptionalField('inputLinkedIn', 'previewLinkedInWrap', 'previewLinkedIn');
bindOptionalField('inputWebsite', 'previewWebsiteWrap', 'previewWebsite');

function renderSkillCloud(inputId, containerId) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);

  if (!input || !container) return;

  function update() {
    const rawSkills = input.value.split(',');
    container.innerHTML = '';
    rawSkills.forEach(skill => {
      const trimmed = skill.trim();
      if (trimmed !== '') {
        const span = document.createElement('span');
        span.className = 'skill-pill';
        span.innerText = trimmed;
        container.appendChild(span);
      }
    });
  }

  input.addEventListener('input', update);
  update();
}

renderSkillCloud('inputTechSkills', 'previewTechSkills');
renderSkillCloud('inputSoftSkills', 'previewSoftSkills');

const templateSelect = document.getElementById('templateSelect');
const resumeSheet = document.getElementById('resumeSheet');

if (templateSelect && resumeSheet) {
  templateSelect.addEventListener('change', (e) => {
    resumeSheet.classList.remove('template-modern', 'template-minimal', 'template-executive');
    resumeSheet.classList.add(e.target.value);
  });
}

const colorDots = document.querySelectorAll('.color-dot');
const root = document.documentElement;

colorDots.forEach(dot => {
  dot.addEventListener('click', () => {
    colorDots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');

    const color = dot.getAttribute('data-color');
    root.style.setProperty('--accent-color', color);
    
    if (color === '#0f172a') {
      root.style.setProperty('--accent-light', '#f1f5f9');
    } else {
      root.style.setProperty('--accent-light', color + '15');
    }
  });
});

function openModal() {
  document.getElementById('leadModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('leadModal').style.display = 'none';
}

function submitAndDownload() {
  const name = document.getElementById('leadName').value.trim();
  const email = document.getElementById('leadEmail').value.trim();

  if (!name || !email) {
    alert('Please enter both your name and email address.');
    return;
  }

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyOZ-C5pwlUhUDY5yixKJEMqNVKJqquu2H6EEDOCtCR05-Cv3n7LeJI9sr2cbyVYXo/exec';

  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(geo => {
      sendDataToSheet(geo.city || 'Samundri', geo.country_name || 'Pakistan');
    })
    .catch(() => {
      sendDataToSheet('Samundri', 'Pakistan');
    });

  function sendDataToSheet(city, country) {
    const formData = new URLSearchParams();
    formData.append('timestamp', new Date().toLocaleString());
    formData.append('name', name);
    formData.append('email', email);
    formData.append('city', city);
    formData.append('country', country);

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
  }

  closeModal();
  setTimeout(() => {
    window.print();
  }, 400);
}