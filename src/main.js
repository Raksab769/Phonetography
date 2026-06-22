const gallery = document.querySelector('.gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const fileInput = document.getElementById('file-input');
const STORAGE_KEY = 'phonetography_saved_photos';
const savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Vision API removed: no getVisionApiKey function needed

function getImageDescription(fileName) {
  const name = fileName.replace(/\.[^.]+$/, '');
  return name || 'Uploaded image';
}

function savePhotosToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPhotos));
}

function generatePhotoId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function deleteSavedPhoto(photoId) {
  const index = savedPhotos.findIndex(photo => photo.id === photoId);
  if (index !== -1) {
    savedPhotos.splice(index, 1);
    savePhotosToStorage();
  }
  const card = gallery.querySelector(`[data-id="${photoId}"]`);
  if (card) {
    card.remove();
  }
}

function createDeleteButton(photoId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'delete-photo';
  button.textContent = 'Delete';
  button.addEventListener('click', event => {
    event.stopPropagation();
    deleteSavedPhoto(photoId);
  });
  return button;
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

function addPhotoCard(src, caption, description = 'Uploaded image', options = {}) {
  const card = document.createElement('article');
  card.className = 'photo-card';
  card.title = 'Hover for details';
  card.dataset.src = src;
  card.dataset.caption = caption;
  card.dataset.description = description;

  if (options.photoId) {
    card.dataset.id = options.photoId;
  }

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

  if (options.deletable && options.photoId) {
    const deleteButton = createDeleteButton(options.photoId);
    card.append(deleteButton);
  }

  gallery.prepend(card);
  return card;
}

async function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  for (const file of files) {
    const url = await readFileAsDataURL(file);
    const caption = file.name.replace(/\.[^.]+$/, '');
    const placeholder = 'Analyzing image...';
    const photoId = generatePhotoId();
    const card = addPhotoCard(url, caption, placeholder, { photoId, deletable: true });
    const description = await analyzeImage(file);
    updateCardDescription(card, description);

    savedPhotos.unshift({
      id: photoId,
      src: url,
      caption,
      description
    });
    savePhotosToStorage();
  }

  fileInput.value = '';
}

gallery.addEventListener('click', event => {
  if (event.target.classList.contains('delete-photo')) return;
  const card = event.target.closest('.photo-card');
  if (!card) return;

  const src = card.dataset.src;
  const caption = card.dataset.caption;
  const description = card.dataset.description || '';
  openLightbox(src, caption, description);
});

// Vision API removed: no apiKey input to listen for

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

function loadSavedPhotos() {
  if (!Array.isArray(savedPhotos) || savedPhotos.length === 0) return;

  savedPhotos.slice().reverse().forEach(photo => {
    addPhotoCard(photo.src, photo.caption, photo.description, {
      photoId: photo.id,
      deletable: true
    });
  });
}

window.addEventListener('load', () => {
  loadSavedPhotos();
});
