# Google Drive Integration Setup

Follow these steps to enable Google Drive storage for your uploaded images.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project**
3. Name it `Phonetography` and click **Create**
4. Wait for the project to be created

## Step 2: Enable Google Drive API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for `Google Drive API`
3. Click on it and press **Enable**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. You may need to configure the OAuth consent screen first:
   - Click **Configure Consent Screen**
   - Choose **External** for User Type
   - Fill in the required fields
   - Click **Save and Continue**
4. Back on Credentials page, click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (for development)
   - `file://` (for local file access)
7. Click **Create**
8. Copy your **Client ID**

## Step 4: Add Client ID to Your App

1. Open `src/main.js` in your editor
2. Find this line:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   ```
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID from Step 3
4. Save the file

## Step 5: Test It

1. Run `npm run dev` to start your app
2. Click the **"Sign in with Google"** button
3. Sign in with your Google account
4. Upload images - they will now be saved to your Google Drive automatically!

## Notes

- Images are stored in your Google Drive in a folder marked with the property `phonetography: true`
- Images persist across browser sessions
- Your authentication token is stored locally in the browser
- You can sign out anytime using the button
