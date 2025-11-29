# ⚠️ IMPORTANT: Restart Required

## Environment Variables Need Server Restart

Vue CLI only loads environment variables from `.env` files **when the development server starts**.

### If you see "API Key Missing" warning:

1. **Stop your current dev server:**
   - Press `Ctrl+C` in the terminal where `npm run serve` is running

2. **Restart the dev server:**
   ```bash
   npm run serve
   ```

3. **Refresh your browser**

### Why is this needed?

- Vue CLI reads `.env` files only during server startup
- Changes to `.env` files are NOT hot-reloaded
- You must restart the server for new/changed environment variables to take effect

### Quick Check:

After restarting, open browser console (F12) and you should see:
```
Google Maps API Key Status: Found
```

If you still see "NOT FOUND", check:
- ✅ `.env` file exists in `crud-app` folder
- ✅ Variable name is exactly: `VUE_APP_GOOGLE_MAPS_API_KEY`
- ✅ No spaces around the `=` sign
- ✅ No quotes around the API key value
- ✅ Server was restarted after creating/updating `.env`

