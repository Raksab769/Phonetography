# Phonetography Website — Instagram Auto-Sync Setup

## What it does
Every time someone opens your website, it fetches your latest Instagram
posts automatically. No manual updates, no re-deploying the site.

---

## 3-Step Instagram Setup

### Step 1 — Switch to a Creator account (free)
1. Open Instagram app → Settings → Account
2. Tap "Switch to Professional Account"
3. Choose **Creator** → pick any category → Done

### Step 2 — Create a Meta Developer App
1. Go to https://developers.facebook.com/apps
2. Click **Create App** → type "Other" → "Consumer"
3. Name your app → Create
4. Click **Add Product** → find **Instagram API** → Set Up
5. Go to Instagram API → **Generate Token** → select your account

### Step 3 — Get a Long-Lived Token (valid 60 days)
Using curl (replace YOUR_APP_ID, YOUR_APP_SECRET, YOUR_SHORT_TOKEN):

```bash
curl "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&access_token=YOUR_SHORT_TOKEN"
```

Copy the `access_token` from the response.

### Step 4 — Connect to the website
1. Open index.html in a browser
2. The setup dialog appears → paste your token → click Connect
3. Your Instagram posts load automatically

---

## Refreshing the Token (every 60 days)
- A warning banner appears 7 days before expiry
- Click Settings (top right) → click **↺ Refresh**
- The site refreshes your token automatically

---

## Deploying Options

| Option     | Steps |
|------------|-------|
| GitHub Pages | Push to a repo → Settings → Pages → Deploy from main |
| Netlify    | Drag the folder to app.netlify.com/drop |
| Vercel     | `npx vercel` inside the folder |
| Your host  | Upload index.html via FTP/cPanel |

> **Note**: The site must be served over HTTP/HTTPS (not opened as a file://).
> Use VS Code Live Server for local testing.

---

## Importing into Eclipse IDE
1. File → Import → General → Existing Projects into Workspace
2. Browse to the `phonetography-website` folder → Finish
3. Right-click index.html → Open With → Web Browser (or use Live Server)

---

## Customising Your Page
Click **Settings** (⚙ top right) to update:
- Your name, tagline, and about text
- Primary device shown in the hero
- Your gear showcase
- Instagram handle (used for links)

All settings are stored in your browser's localStorage.
