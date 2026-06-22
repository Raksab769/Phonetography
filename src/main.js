const gallery = document.querySelector('.gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const fileInput = document.getElementById('file-input');
const apiKeyInput = document.getElementById('api-key-input');

const savedVisionKey = localStorage.getItem('visionApiKey');
if (savedVisionKey) {
  apiKeyInput.value = savedVisionKey;
}

function getVisionApiKey() {
  return apiKeyInput.value.trim();
}

function openLightbox(src, caption, description = '') {
  lightboxImage.src = src;
  lightboxCaption.textContent = description ? `${caption} — ${description}` : caption;
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function updateCardDescription(card, description) {
  card.dataset.description = description;
  const descriptionEl = card.querySelector('.photo-description');
  if (descriptionEl) {
    descriptionEl.textContent = description;
  }
}

async function analyzeImage(file) {
  const visionKey = getVisionApiKey();
  if (!visionKey) {
    return `Uploaded image file: ${file.name}`;
  }

  try {
    const content = await fileToBase64(file);
    const visionKey = getVisionApiKey();
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content },
              features: [
                { type: 'LABEL_DETECTION', maxResults: 6 },
                { type: 'WEB_DETECTION', maxResults: 5 }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      return `Uploaded image file: ${file.name}`;
    }

    const result = await response.json();
    const annotation = result.responses?.[0];
    const labels = annotation?.labelAnnotations?.map(item => item.description) ?? [];
    const web = annotation?.webDetection?.webEntities?.map(item => item.description).filter(Boolean) ?? [];
    const details = [];
    if (labels.length) {
      details.push(`Detected ${labels.slice(0, 4).join(', ')}`);
    }
    if (web.length) {
      details.push(`Related to ${web.slice(0, 3).join(', ')}`);
    }
    return details.length ? details.join(' · ') : `Uploaded image file: ${file.name}`;
  } catch {
    return `Uploaded image file: ${file.name}`;
  }
}

function closeLightbox() {
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function addPhotoCard(src, caption, description = 'Uploaded image') {
  const card = document.createElement('article');
  card.className = 'photo-card';
  card.title = 'Hover for details';
  card.dataset.src = src;
  card.dataset.caption = caption;
  card.dataset.description = description;

  const img = document.createElement('img');
  img.src = src;
  img.alt = caption;

  const info = document.createElement('div');
  info.className = 'photo-info';

  const title = document.createElement('p');
  title.className = 'photo-title';
  title.textContent = caption;

  const descriptionElement = document.createElement('p');
  descriptionElement.className = 'photo-description';
  descriptionElement.textContent = description;

  info.append(title, descriptionElement);
  card.append(img, info);
  gallery.prepend(card);
  return card;
}

function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  files.forEach(async file => {
    const url = URL.createObjectURL(file);
    const caption = file.name.replace(/\.[^.]+$/, '');
    const placeholder = 'Analyzing image...';
    const card = addPhotoCard(url, caption, placeholder);
    const description = await analyzeImage(file);
    updateCardDescription(card, description);
  });

  fileInput.value = '';
}

gallery.addEventListener('click', event => {
  const card = event.target.closest('.photo-card');
  if (!card) return;

  const src = card.dataset.src;
  const caption = card.dataset.caption;
  const description = card.dataset.description || '';
  openLightbox(src, caption, description);
});

apiKeyInput.addEventListener('input', event => {
  localStorage.setItem('visionApiKey', event.target.value.trim());
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
    closeLightbox();
  }
});

fileInput.addEventListener('change', handleFileUpload);
