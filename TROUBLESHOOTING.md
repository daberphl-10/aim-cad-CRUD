# Troubleshooting: API Key Not Loading

## If restarting doesn't work, try these steps:

### 1. Verify .env File Location
The `.env` file MUST be in the `crud-app` folder (same level as `package.json`):
```
crud-app/
  ├── .env          ← Must be here
  ├── package.json
  ├── src/
  └── ...
```

### 2. Check .env File Format
Open `crud-app/.env` and verify:
- ✅ No spaces around `=`
- ✅ No quotes around the value
- ✅ Variable name is exactly: `VUE_APP_GOOGLE_MAPS_API_KEY`
- ✅ No blank lines before the variable

**Correct:**
```
VUE_APP_GOOGLE_MAPS_API_KEY=AIzaSyBy73Zngwr-1WrVhIKn2A2gVQGMOv0WMxM
```

**Wrong:**
```
VUE_APP_GOOGLE_MAPS_API_KEY = AIzaSy...  ← Spaces around =
VUE_APP_GOOGLE_MAPS_API_KEY="AIzaSy..." ← Quotes
VUE_APP_GOOGLE_MAPS_API_KEY =AIzaSy...  ← Space before =
```

### 3. Complete Server Restart
1. **Stop the server completely:**
   - Press `Ctrl+C` in the terminal
   - Wait until you see the command prompt again
   - If it doesn't stop, close the terminal window

2. **Clear any cached files:**
   ```bash
   cd crud-app
   rm -rf node_modules/.cache
   # Or on Windows:
   rmdir /s /q node_modules\.cache
   ```

3. **Restart the server:**
   ```bash
   npm run serve
   ```

### 4. Check Browser Console
After restarting, open browser console (F12) and look for:
```
=== Google Maps API Key Debug ===
process.env.VUE_APP_GOOGLE_MAPS_API_KEY: AIzaSyBy73Zng...
this.googleMapsApiKey: AIzaSyBy73Zng...
API Key Status: ✅ Found
===============================
```

### 5. Hard Refresh Browser
- **Chrome/Edge:** `Ctrl+Shift+R` or `Ctrl+F5`
- **Firefox:** `Ctrl+Shift+R` or `Ctrl+F5`
- Or clear browser cache

### 6. Try Incognito/Private Mode
Sometimes browser extensions or cache can interfere. Try opening the app in incognito mode.

### 7. Check for Multiple .env Files
Make sure you don't have conflicting `.env` files:
- `.env`
- `.env.local`
- `.env.development`
- `.env.development.local`

If you have multiple, `.env.local` takes precedence. Check all of them.

### 8. Verify Server Terminal Output
When you start `npm run serve`, check the terminal output. You should see:
```
Environment variables loaded:
VUE_APP_GOOGLE_MAPS_API_KEY: ✅ Found
```

### 9. Alternative: Temporary Hardcode (For Testing Only)
If nothing works, you can temporarily hardcode the API key in `MapView.vue`:

```javascript
data() {
  return {
    googleMapsApiKey: 'AIzaSyBy73Zngwr-1WrVhIKn2A2gVQGMOv0WMxM', // TEMPORARY - Remove before committing
    // ... rest of data
  }
}
```

**⚠️ WARNING:** Remove this before committing to git! Never commit API keys to version control.

### 10. Check Port Number
If you're running on port 8081 instead of 8080, that's fine - it just means 8080 was in use. The port doesn't affect environment variable loading.

### Still Not Working?

1. Check if there are any errors in the terminal when starting the server
2. Verify the .env file encoding is UTF-8 (not UTF-16 or other)
3. Try creating a new .env file from scratch
4. Check if you have any build tools or processes that might be interfering

