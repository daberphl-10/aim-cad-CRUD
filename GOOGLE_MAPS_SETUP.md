# Google Maps API Setup Guide

## Fixing InvalidKeyMapError

If you're seeing `InvalidKeyMapError`, follow these steps:

### Step 1: Verify Your API Key is Set

1. Check that your `.env` file exists in the `crud-app` folder
2. Verify it contains:
   ```
   VUE_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
3. **IMPORTANT**: Restart your Vue development server after creating/updating `.env`
   ```bash
   # Stop the server (Ctrl+C)
   npm run serve
   ```

### Step 2: Verify API Key in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Find your API key and click on it
4. Verify:
   - ✅ **API restrictions**: Make sure "Maps JavaScript API" is enabled
   - ✅ **Application restrictions**: 
     - For development: Use "HTTP referrers" and add:
       - `http://localhost:*`
       - `http://127.0.0.1:*`
     - Or set to "None" for testing (not recommended for production)

### Step 3: Enable Required APIs

Make sure these APIs are enabled in your Google Cloud project:

1. **Maps JavaScript API** (Required)
   - Go to [APIs & Services](https://console.cloud.google.com/apis/library)
   - Search for "Maps JavaScript API"
   - Click "Enable"

2. **Geocoding API** (Optional, but recommended)
   - Search for "Geocoding API"
   - Click "Enable"

### Step 4: Check Billing

- Google Maps requires a billing account (even for free tier)
- Go to [Billing](https://console.cloud.google.com/billing) and ensure billing is enabled
- Free tier includes $200 credit per month

### Step 5: Verify Environment Variable Loading

1. Open browser console (F12)
2. Look for the log message: `Google Maps API Key: Loaded` or `NOT LOADED`
3. If it says "NOT LOADED":
   - Check `.env` file exists and is in the correct location (`crud-app/.env`)
   - Verify the variable name is exactly: `VUE_APP_GOOGLE_MAPS_API_KEY`
   - Restart the dev server

### Step 6: Test Your API Key

You can test if your API key works by visiting this URL in your browser:
```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your actual key. If it loads without errors, the key is valid.

### Common Issues:

1. **"API key not valid"**
   - Double-check you copied the entire key (no spaces, no extra characters)
   - Make sure you're using the correct key from Google Cloud Console

2. **"This API key is not authorized"**
   - Check API restrictions in Google Cloud Console
   - Make sure "Maps JavaScript API" is enabled

3. **"RefererNotAllowedMapError"**
   - Add your domain to HTTP referrer restrictions
   - For localhost: Add `http://localhost:*` and `http://127.0.0.1:*`

4. **Environment variable not loading**
   - Restart the dev server after creating/updating `.env`
   - Check that variable name starts with `VUE_APP_`
   - No spaces around the `=` sign

### Quick Checklist:

- [ ] `.env` file exists in `crud-app` folder
- [ ] Variable name is `VUE_APP_GOOGLE_MAPS_API_KEY`
- [ ] API key is valid (no extra spaces/characters)
- [ ] Maps JavaScript API is enabled in Google Cloud
- [ ] Billing is enabled in Google Cloud
- [ ] Dev server was restarted after creating `.env`
- [ ] HTTP referrer restrictions allow localhost (if set)

### Still Having Issues?

1. Check browser console for detailed error messages
2. Verify API key in Google Cloud Console > APIs & Services > Credentials
3. Check API usage in Google Cloud Console > APIs & Services > Dashboard
4. Ensure you're using the correct project in Google Cloud Console

