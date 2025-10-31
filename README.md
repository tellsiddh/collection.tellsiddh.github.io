# 📚 My Collections - Link Saver PWA

A simple Progressive Web App (PWA) that lets you save and organize links from Instagram, Reddit, and other social media platforms directly from the share menu.

## ✨ Features

- 📱 **PWA Support**: Install as an app on your phone
- 🔗 **Share Target**: Receive shared links from other apps (Android)
- 💾 **Local Storage**: All your links are saved locally in your browser
- 🏷️ **Organize**: Add titles and notes to your saved links
- 🎨 **Clean UI**: Simple, intuitive interface
- 📱 **Mobile-First**: Optimized for mobile usage
- ⚡ **Offline Ready**: Works offline once installed

## 🚀 Quick Start

### 1. Run Locally

```bash
# Navigate to the project folder
cd /Users/siddarthjain/Documents/mygithub/collection.tellsiddh.com

# Start the local server
python3 server.py
```

The app will open at `http://localhost:8080`

### 2. Install as PWA

**On Android (Chrome/Edge/Brave):**
1. Open the app in Chrome
2. Look for the "Install" icon in the address bar
3. Tap "Install" or "Add to Home Screen"
4. The app will appear on your home screen

**On iPhone (Safari):**
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Name it "My Collections" and tap "Add"

## 📱 How to Use

### Adding Links Manually
1. Open the app
2. Paste a URL in the "Link URL" field
3. Add a title and notes (optional)
4. Tap "Save to Collection"

### Using Share Feature (Android Only)
1. In Instagram, Reddit, or any app, tap Share
2. Look for "Collections" or "My Collections" in the share menu
3. Tap it - the app will open with the link pre-filled
4. Add title/notes and save

### iOS Workaround (Using Shortcuts)
1. Open the Shortcuts app on iPhone
2. Create a new shortcut:
   - Add "Get URLs from Input"
   - Add "Open URLs" with: `http://localhost:8080/save.html?url=[URL]`
3. Save as "Save to Collection"
4. Enable "Show in Share Sheet"

## 📁 Project Structure

```
collection.tellsiddh.com/
├── index.html          # Main app page
├── save.html           # Share target page
├── app.js              # Main application logic
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── icon-192.png       # App icon (192x192)
├── icon-512.png       # App icon (512x512)
├── server.py          # Development server
└── README.md          # This file
```

## 🔧 Technical Details

### PWA Features
- **Manifest**: Defines app metadata and install behavior
- **Service Worker**: Enables offline functionality and caching
- **Share Target API**: Handles shared content from other apps
- **Local Storage**: Persists data without a backend

### Supported Platforms
- ✅ **Android Chrome**: Full PWA support + Share Target
- ✅ **Android Edge/Brave**: Full PWA support + Share Target  
- ✅ **iOS Safari**: PWA install (no Share Target)
- ✅ **Desktop Chrome/Edge**: PWA install
- ❌ **iOS Chrome**: Limited PWA support

### Data Storage
All your links are stored locally in your browser's localStorage:
- No server required
- No data sent to external services
- Your privacy is protected
- Data persists across app sessions

## 📤 Deploying to Production

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

1. **Netlify/Vercel:**
   - Drag and drop the folder to their dashboard
   - Your app will be live at `https://your-app.netlify.app`

2. **GitHub Pages:**
   ```bash
   # Push to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/my-collections.git
   git push -u origin main
   
   # Enable GitHub Pages in repo settings
   ```

### Option 2: Your Own Domain
Upload all files to your web server. Make sure HTTPS is enabled for full PWA functionality.

## 🛠️ Customization

### Change App Name/Colors
Edit `manifest.json`:
```json
{
  "name": "Your Custom Name",
  "theme_color": "#your-color"
}
```

### Add New Features
- Edit `app.js` for new functionality
- Modify `index.html` for UI changes
- Update `sw.js` for offline behavior

### Export/Import Data
The app includes functions to export your data as JSON:
```javascript
exportData(); // Downloads JSON file
importData(fileInput); // Imports from JSON file
```

## 🐛 Troubleshooting

### App not appearing in share menu (Android)
1. Make sure you installed the PWA (Add to Home Screen)
2. Try opening and closing the app once after installation
3. Check that you're using Chrome/Edge (not Safari)

### PWA not installing
1. Ensure you're on HTTPS (or localhost for testing)
2. Check that all PWA requirements are met (manifest, service worker, icons)
3. Try clearing browser cache and reloading

### Links not saving
1. Check browser console for JavaScript errors
2. Ensure localStorage isn't disabled
3. Try clearing browser data and restarting

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests!

---

**Enjoy collecting your favorite links! 📚✨**