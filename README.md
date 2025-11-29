# crud-app

## Project setup
```
npm install
```

### Google Maps API Setup

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for address lookup)
3. Create a `.env` file in the root of `crud-app` directory:
   ```
   VUE_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
4. Replace `your_api_key_here` with your actual Google Maps API key

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Map Features

The application includes a comprehensive map view (`/map`) that displays:
- **Farm Locations**: All farms are shown as markers on the map
- **Tree Locations**: When a farm is selected, all trees within that farm are displayed
- **Interactive Legend**: Color-coded legend showing different tree statuses:
  - 🟢 Green: Healthy trees
  - 🟡 Yellow: Trees needing attention
  - 🔴 Red: Critical/sick trees
  - ⚫ Gray: Unknown status
- **Info Windows**: Click on farms or trees to see detailed information
- **Navigation**: Easy navigation between farm view and tree view

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
