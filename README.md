# Phonetography

A mobile photography showcase with automatic image analysis. Upload photos from your device or Google Drive and get instant AI-powered descriptions using Google Cloud Vision.

## Features

- Responsive photo gallery with hover details
- File upload with automatic image analysis
- Google Cloud Vision API integration for intelligent image descriptions
- Click-to-open lightbox preview
- Mobile-first styling with modern visuals
- Vanilla JavaScript with zero dependencies
- Persistent API key storage

## Quick start

```bash
cd ~/phonetography-app
npm install
npm run dev
```

Open the local URL shown in the terminal to preview the gallery.

## Setup

1. Get a [Google Cloud Vision API key](https://cloud.google.com/vision)
2. Paste your API key in the "Google Vision API key" field on the page
3. Upload images and watch them get analyzed automatically

## Project files

- `index.html` – application entry point
- `src/styles.css` – gallery, lightbox, and upload styles
- `src/main.js` – gallery interaction and Vision API integration
- `package.json` – development scripts
