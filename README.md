# Phonetography

A mobile photography showcase with automatic image analysis and Google Drive storage. Upload photos from your device or Google Drive and get instant AI-powered descriptions using Google Cloud Vision.

## Features

- Responsive photo gallery with hover details
- File upload with automatic image analysis
- **Google Drive integration** for persistent image storage
- Google Cloud Vision API integration for intelligent image descriptions
- Click-to-open lightbox preview
- Mobile-first styling with modern visuals
- Vanilla JavaScript with zero dependencies
- Persistent API key and authentication storage

## Quick start

```bash
cd ~/phonetography-app
npm install
npm run dev
```

Open the local URL shown in the terminal to preview the gallery.

## Setup

### Vision API (Automatic Image Descriptions)

1. Get a [Google Cloud Vision API key](https://cloud.google.com/vision)
2. Paste your API key in the "Google Vision API key" field on the page
3. Upload images and watch them get analyzed automatically

### Google Drive Storage (Persist Images)

1. Follow the [Google Drive Setup Guide](./GOOGLE_DRIVE_SETUP.md)
2. Once configured, sign in with Google on the page
3. All uploaded images will automatically save to your Google Drive

## Project files

- `index.html` – application entry point
- `src/styles.css` – gallery, lightbox, and UI styles
- `src/main.js` – gallery interaction, Vision API, and Drive integration
- `package.json` – development scripts
- `GOOGLE_DRIVE_SETUP.md` – detailed Google Drive setup instructions
