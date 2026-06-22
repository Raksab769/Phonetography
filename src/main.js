const gallery = document.querySelector('.gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const fileInput = document.getElementById('file-input');
const authButton = document.getElementById('auth-button');
const userNameSpan = document.getElementById('user-name');

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
let uploadedImages = [];

const savedUserName = localStorage.getItem('googleUserName');
if (savedUserName) {
  userNameSpan.textContent = `Welcome, ${savedUserName.split(' ')[0]}!`;
  authButton.textContent = 'Signed in';
  authButton.classList.add('signed-in');
  authButton.disabled = true;
}

function getVisionApiKey() {
  return apiKeyInput.value.trim();
}

function initGoogleAuth() {
  if (window.google && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleAuthResponse
    });
  }
}

function handleAuthResponse(response) {
  if (response.credential) {
    const token = response.credential;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userName = decoded.name || decoded.email;
    
    userNameSpan.textContent = `Welcome, ${userName.split(' ')[0]}!`;
    authButton.textContent = 'Signed in';
    authButton.classList.add('signed-in');
    authButton.disabled = true;
    
    localStorage.setItem('googleToken', token);
    localStorage.setItem('googleUserName', userName);
  }
}

async function uploadToDrive(file) {
  const token = localStorage.getItem('googleToken');
  if (!token || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
    return null;
  }

  try {
    const metadata = {
      name: file.name,
      mimeType: file.type,
      properties: { 'phonetography': 'true' }
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    uploadedImages.push({ id: data.id, name: data.name, link: data.webViewLink });
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
    return data;
  } catch (error) {
    console.error('Drive upload error:', error);
    return null;
  }
}

function getImageDescription(fileName) {
  const name = fileName.replace(/\.[^.]+$/, '');
  return name || 'Uploaded image';
}

function openLightbox(src, caption, description = '') {
  lightboxImage.src = src;
  lightboxCaption.textContent = description ? `${caption} — ${description}` : caption;
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function updateCardDescription(card, description) {
  card.dataset.description = description;
  const descriptionEl = card.querySelector('.photo-description');
  if (descriptionEl) {
    descriptionEl.textContent = description;
  }
}

async function analyzeImage(file) {
  return getImageDescription(file.name);
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
    
    // Upload to Google Drive if authenticated
    const driveResult = await uploadToDrive(file);
    if (driveResult) {
      card.dataset.driveId = driveResult.id;
    }
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

authButton.addEventListener('click', () => {
  if (authButton.classList.contains('signed-in')) {
    localStorage.removeItem('googleToken');
    localStorage.removeItem('googleUserName');
    userNameSpan.textContent = '';
    authButton.textContent = 'Sign in with Google';
    authButton.classList.remove('signed-in');
    authButton.disabled = false;
  } else if (window.google && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
    window.google.accounts.id.renderButton(authButton, {
      theme: 'outline',
      size: 'large'
    });
  } else {
    alert('Please configure your Google Client ID in src/main.js');
  }
});

// Initialize Google Auth when page loads
window.addEventListener('load', () => {
  initGoogleAuth();
});
