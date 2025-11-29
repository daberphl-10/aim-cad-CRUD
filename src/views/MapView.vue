<template>
  <div class="map-container">
    <div class="map-wrapper">
      <GoogleMap
        v-if="googleMapsApiKey && googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY'"
        :api-key="googleMapsApiKey"
        style="width: 100%; height: 100vh"
        :center="center"
        :zoom="zoom"
        :options="{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true
        }"
        @click="onMapClick"
        @error="onMapError"
        @bounds_changed="onBoundsChanged"
      >
        <!-- Farm Markers -->
        <!-- /** */<Marker
          v-for="farm in farmsWithCoordinates"
          :key="`farm-${farm.id}`"
          :options="{
            position: { 
              lat: parseFloat(farm.latitude), 
              lng: parseFloat(farm.longitude) 
            },
            label: {
              text: farm.name || `F${farm.id}`,
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold'
            },
            icon: {
              path: 'M10 0C4.477 0 0 4.477 0 10c0 5.523 10 15 10 15s10-9.477 10-15c0-5.523-4.477-10-10-10zm0 13c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z',
              fillColor: '#007bff',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
              scale: 1.5,
              anchor: new google.maps.Point(10, 25)
            },
            title: farm.name || `Farm ${farm.id}`,
            animation: google?.maps?.Animation?.DROP
          }"
          @click="onFarmClick(farm)"
        />**/ -->

        <!-- Tree Markers -->
        <Marker
          v-for="tree in visibleTrees.filter(t => t.latitude && t.longitude)"
          :key="`tree-${tree.id}`"
          :options="{
            position: { lat: parseFloat(tree.latitude), lng: parseFloat(tree.longitude) },
            label: {
              text: tree.tree_code || `T${tree.id}`,
              color: '#fff',
              fontSize: '10px',
              fontWeight: 'bold'
            },
            icon: getTreeIcon(tree),
            title: `${tree.tree_code || 'Tree'} - ${tree.status || 'Unknown'}`
          }"
          @click="onTreeClick(tree)"
        />

        <!-- Info Window for selected farm -->
        <InfoWindow
          v-if="selectedFarm"
          :options="{
            position: {
              lat: parseFloat(selectedFarm.latitude),
              lng: parseFloat(selectedFarm.longitude)
            }
          }"
        >
          <div class="info-window">
            <h6><strong>{{ selectedFarm.name }}</strong></h6>
            <p><small>Location: {{ selectedFarm.location }}</small></p>
            <p><small>Area: {{ selectedFarm.area_hectares }} hectares</small></p>
            <p><small>Soil Type: {{ selectedFarm.soil_type }}</small></p>
            <button class="btn btn-sm btn-primary mt-2" @click="loadTreesForFarm(selectedFarm.id)">
              View Trees
            </button>
          </div>
        </InfoWindow>

        <!-- Info Window for selected tree -->
        <InfoWindow
          v-if="selectedTree"
          :options="{
            position: {
              lat: parseFloat(selectedTree.latitude),
              lng: parseFloat(selectedTree.longitude)
            }
          }"
        >
          <div class="info-window">
            <h6><strong>{{ selectedTree.tree_code || `Tree #${selectedTree.id}` }}</strong></h6>
            <p><small>Status: {{ selectedTree.status || 'N/A' }}</small></p>
            <p><small>Variety: {{ selectedTree.variety || 'N/A' }}</small></p>
            <p><small>Growth Stage: {{ selectedTree.growth_stage || 'N/A' }}</small></p>
            <p><small>Pods: {{ selectedTree.pod_count || 0 }}</small></p>
            <p><small>Block: {{ selectedTree.block_name || 'N/A' }}</small></p>
          </div>
        </InfoWindow>
      </GoogleMap>
    </div>

    <!-- Legend -->
    <div class="map-legend">
      <div class="legend-header">
        <h5><i class="bi bi-info-circle"></i> Map Legend</h5>
        <div class="legend-stats">
          <small>
            <strong>Farms:</strong> {{ farmsWithCoordinates.length }} / {{ farms.length }}
            <span v-if="visibleTrees.length > 0">
              | <strong>Trees:</strong> {{ visibleTrees.filter(t => t.latitude && t.longitude).length }}
            </span>
          </small>
        </div>
      </div>
      <div class="legend-content">
        <div class="legend-item">
          <div class="legend-icon farm-icon">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <span>Farm Location</span>
        </div>
        <div class="legend-item">
          <div class="legend-icon tree-healthy">
            <i class="bi bi-tree"></i>
          </div>
          <span>Healthy Tree</span>
        </div>
        <div class="legend-item">
          <div class="legend-icon tree-warning">
            <i class="bi bi-tree"></i>
          </div>
          <span>Tree Needs Attention</span>
        </div>
        <div class="legend-item">
          <div class="legend-icon tree-critical">
            <i class="bi bi-tree"></i>
          </div>
          <span>Critical Tree</span>
        </div>
        <div class="legend-item">
          <div class="legend-icon tree-unknown">
            <i class="bi bi-tree"></i>
          </div>
          <span>Unknown Status</span>
        </div>
      </div>
      <div class="legend-actions mt-3">
        <button 
          class="btn btn-sm btn-success w-100" 
          @click="locateFarms"
          v-if="farmsWithCoordinates.length > 0"
        >
          <i class="bi bi-geo-alt"></i> Locate Farm{{ farmsWithCoordinates.length > 1 ? 's' : '' }}
        </button>
        <button 
          class="btn btn-sm btn-secondary w-100 mt-2" 
          @click="resetView"
          v-if="selectedFarm"
        >
          <i class="bi bi-arrow-left"></i> Back to All Farms
        </button>
        <button 
          class="btn btn-sm btn-info w-100 mt-2" 
          @click="refreshData"
        >
          <i class="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading map data...</p>
    </div>

    <!-- API Key Error Message -->
    <div v-if="apiKeyError" class="api-key-error">
      <div class="alert alert-warning">
        <h5><i class="bi bi-exclamation-triangle"></i> Google Maps API Error</h5>
        <p><strong>InvalidKeyMapError</strong></p>
        <p>Your Google Maps API key is invalid or not properly configured.</p>
        <hr>
        <p><strong>Quick Fix:</strong></p>
        <ol style="text-align: left;">
          <li>Verify your API key in <code>crud-app/.env</code> file</li>
          <li>Enable "Maps JavaScript API" in <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
          <li>Restart your dev server: <code>npm run serve</code></li>
          <li>Check API key restrictions allow your domain</li>
        </ol>
        <button class="btn btn-sm btn-primary mt-2" @click="apiKeyError = false">Dismiss</button>
      </div>
    </div>
  </div>
</template>

<script>
/* global google */
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map';
import axios from 'axios';

export default {
  name: 'MapView',
  components: {
    GoogleMap,
    Marker,
    InfoWindow
  },
  inject: ['baseUrl'],
  data() {
    // Try to get API key from environment
    const envKey = 'AIzaSyBy73Zngwr-1WrVhIKn2A2gVQGMOv0WMxM';
    console.log('Environment variable check:', envKey ? 'Found' : 'Not found');
    
    return {
      googleMapsApiKey: envKey || 'YOUR_GOOGLE_MAPS_API_KEY',
      center: { lat: 16.6021, lng: 121.1939 }, // Default to Philippines center (Cebu area)
      zoom: 10,
      farms: [],
      visibleTrees: [],
      selectedFarm: null,
      selectedTree: null,
      loading: false,
      apiKeyError: false
    };
  },
  computed: {
    farmsWithCoordinates() {
      return this.farms.filter(f => {
        const hasLat = f.latitude !== null && f.latitude !== undefined && f.latitude !== '';
        const hasLng = f.longitude !== null && f.longitude !== undefined && f.longitude !== '';
        return hasLat && hasLng;
      });
    }
  },
  watch: {
    googleMapsApiKey(newVal) {
      if (!newVal || newVal === 'YOUR_GOOGLE_MAPS_API_KEY') {
        this.apiKeyError = true;
      }
    },
    farmsWithCoordinates(newVal) {
      console.log('Farms with coordinates updated:', newVal.length);
    }
  },
  mounted() {
    // Debug: Check if API key is loaded
    const apiKeyValue = this.googleMapsApiKey;
    const envValue = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;
    
    console.log('=== Google Maps API Key Debug ===');
    console.log('process.env.VUE_APP_GOOGLE_MAPS_API_KEY:', envValue ? (envValue.substring(0, 15) + '...') : 'undefined');
    console.log('this.googleMapsApiKey:', apiKeyValue ? (apiKeyValue.substring(0, 15) + '...') : 'undefined');
    console.log('API Key Status:', apiKeyValue && apiKeyValue !== 'YOUR_GOOGLE_MAPS_API_KEY' ? '✅ Found' : '❌ NOT FOUND');
    console.log('===============================');
    
    if (this.googleMapsApiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || !this.googleMapsApiKey) {
      console.warn('⚠️ Google Maps API Key not found!');
      console.warn('⚠️ Make sure you restarted the dev server after creating/updating .env file');
      console.warn('⚠️ Check that .env file is in crud-app folder (same level as package.json)');
      
      this.$swal({
        icon: 'warning',
        title: 'API Key Not Loaded',
        html: `
          <p>Google Maps API key is not being loaded from the environment.</p>
          <p><strong>Troubleshooting Steps:</strong></p>
          <ol style="text-align: left; margin: 10px 0;">
            <li>Verify <code>.env</code> file exists in <code>crud-app</code> folder</li>
            <li>Check file contains: <code>VUE_APP_GOOGLE_MAPS_API_KEY=your_key</code></li>
            <li><strong>Completely stop</strong> the dev server (Ctrl+C)</li>
            <li>Wait a few seconds, then restart: <code>npm run serve</code></li>
            <li>Hard refresh browser (Ctrl+Shift+R or Ctrl+F5)</li>
            <li>Check browser console (F12) for debug info</li>
          </ol>
          <p style="margin-top: 15px; color: #666;">
            <small>Note: If still not working, try clearing browser cache or using incognito mode.</small>
          </p>
        `,
        confirmButtonText: 'I understand',
        width: '650px'
      });
    }
    this.loadFarms();
  },
  methods: {
    getFarmMarkerOptions(farm) {
      return {
        position: {
          lat: parseFloat(farm.latitude),
          lng: parseFloat(farm.longitude)
        },
        label: {
          text: farm.name || `F${farm.id}`,
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        },
        icon: {
          path: 'M10 0C4.477 0 0 4.477 0 10c0 5.523 10 15 10 15s10-9.477 10-15c0-5.523-4.477-10-10-10zm0 13c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z',
          fillColor: '#007bff',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
          scale: 1.5,
          anchor: new google.maps.Point(10, 25)
        },
        title: farm.name || `Farm ${farm.id}`,
        animation: google.maps.Animation.DROP
      };
    },
    async loadFarms() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const baseUrl = this.baseUrl || 'http://127.0.0.1:8000/api';
        
        console.log('Loading farms from:', `${baseUrl}/farms`);
        const response = await axios.get(`${baseUrl}/farms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Handle paginated response (admin) or direct array (farmer)
        const farmsData = response.data.data || response.data;
        this.farms = Array.isArray(farmsData) ? farmsData : [];
        
        console.log('Farms loaded:', this.farms.length);
        console.log('Farms data:', this.farms);
        
        // Count farms with coordinates
        const farmsWithCoords = this.farms.filter(f => f.latitude && f.longitude);
        console.log('Farms with coordinates:', farmsWithCoords.length);
        
        if (farmsWithCoords.length === 0 && this.farms.length > 0) {
          console.warn('⚠️ Farms loaded but none have latitude/longitude coordinates!');
          this.$swal({
            icon: 'warning',
            title: 'No Coordinates',
            html: `
              <p>Found ${this.farms.length} farm(s), but none have location coordinates.</p>
              <p>Please add latitude and longitude to your farms to see them on the map.</p>
            `,
            confirmButtonText: 'OK'
          });
        }
        
        // Center map on first farm with coordinates
        if (farmsWithCoords.length > 0) {
          const firstFarm = farmsWithCoords[0];
          const lat = parseFloat(firstFarm.latitude);
          const lng = parseFloat(firstFarm.longitude);
          
          console.log('=== Farm Location Debug ===');
          console.log('Farm name:', firstFarm.name);
          console.log('Farm ID:', firstFarm.id);
          console.log('Raw coordinates:', { lat: firstFarm.latitude, lng: firstFarm.longitude });
          console.log('Parsed coordinates:', { lat, lng });
          
          // Validate coordinates
          if (isNaN(lat) || isNaN(lng)) {
            console.error('❌ Invalid coordinates (NaN):', firstFarm);
            this.$swal({
              icon: 'error',
              title: 'Invalid Coordinates',
              text: `Farm "${firstFarm.name || 'Farm ' + firstFarm.id}" has invalid coordinates. Please check the latitude and longitude values.`
            });
          } else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.error('❌ Coordinates out of range:', { lat, lng });
            this.$swal({
              icon: 'error',
              title: 'Invalid Coordinates',
              text: `Farm "${firstFarm.name || 'Farm ' + firstFarm.id}" has coordinates outside valid range.`
            });
          } else {
            this.center = { lat, lng };
            this.zoom = 16; // Zoom in closer to see the farm clearly
            console.log('✅ Map centered on:', this.center);
            console.log('✅ Zoom level:', this.zoom);
            console.log('========================');
            
            // Show success message after a short delay
            setTimeout(() => {
              this.$swal({
                icon: 'success',
                title: 'Farm Located',
                text: `Map centered on ${firstFarm.name || 'your farm'}`,
                timer: 3000,
                showConfirmButton: false
              });
            }, 1000);
          }
        } else if (this.farms.length === 0) {
          console.warn('⚠️ No farms found for this user');
          this.$swal({
            icon: 'info',
            title: 'No Farms',
            text: 'You don\'t have any farms yet. Create a farm to see it on the map.',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('Error loading farms:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to load farms. ';
        if (error.response?.status === 401) {
          errorMessage += 'Please log in again.';
        } else if (error.response?.status === 403) {
          errorMessage += 'You don\'t have permission to view farms.';
        } else if (!error.response) {
          errorMessage += 'Cannot connect to the server. Make sure the Laravel API is running.';
        } else {
          errorMessage += 'Please check your connection and try again.';
        }
        
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
      } finally {
        this.loading = false;
      }
    },
    async loadTreesForFarm(farmId) {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const baseUrl = this.baseUrl || 'http://127.0.0.1:8000/api';
        const response = await axios.get(`${baseUrl}/farms/${farmId}/cacao-trees`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.visibleTrees = response.data;
        this.selectedTree = null;
        
        // Center map on farm
        const farm = this.farms.find(f => f.id === farmId);
        if (farm) {
          this.center = {
            lat: parseFloat(farm.latitude),
            lng: parseFloat(farm.longitude)
          };
          this.zoom = 15; // Zoom in to see trees better
        }
      } catch (error) {
        console.error('Error loading trees:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load trees for this farm.'
        });
      } finally {
        this.loading = false;
      }
    },
    onFarmClick(farm) {
      this.selectedFarm = farm;
      this.selectedTree = null;
      this.loadTreesForFarm(farm.id);
    },
    onTreeClick(tree) {
      this.selectedTree = tree;
    },
    onMapClick() {
      // Optionally clear selection when clicking on map
      // this.selectedFarm = null;
      // this.selectedTree = null;
    },
    getTreeIcon(tree) {
      const status = (tree.status || '').toLowerCase();
      let color = '#808080'; // Default gray for unknown
      
      if (status.includes('healthy') || status.includes('good')) {
        color = '#28a745'; // Green
      } else if (status.includes('warning') || status.includes('needs attention')) {
        color = '#ffc107'; // Yellow
      } else if (status.includes('critical') || status.includes('disease') || status.includes('sick')) {
        color = '#dc3545'; // Red
      }
      
      // Create a custom icon using a colored circle
      // Using a data URL for a simple colored circle marker
      const size = 20;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      return {
        url: canvas.toDataURL(),
        scaledSize: { width: size, height: size },
        anchor: { x: size / 2, y: size / 2 }
      };
    },
    resetView() {
      this.selectedFarm = null;
      this.selectedTree = null;
      this.visibleTrees = [];
      this.zoom = 10;
      if (this.farms.length > 0 && this.farms[0].latitude && this.farms[0].longitude) {
        this.center = {
          lat: parseFloat(this.farms[0].latitude),
          lng: parseFloat(this.farms[0].longitude)
        };
      }
    },
    refreshData() {
      this.loadFarms();
      this.resetView();
    },
    onMapError(error) {
      console.error('Google Maps Error:', error);
      if (error && (error.message?.includes('InvalidKey') || error.message?.includes('ApiNotActivatedMapError'))) {
        this.apiKeyError = true;
      }
    },
    onBoundsChanged() {
      // Debug: Log when map bounds change
      console.log('Map bounds changed, current center:', this.center, 'zoom:', this.zoom);
    },
    locateFarms() {
      if (this.farmsWithCoordinates.length === 0) {
        this.$swal({
          icon: 'warning',
          title: 'No Farms',
          text: 'No farms with coordinates found.'
        });
        return;
      }

      if (this.farmsWithCoordinates.length === 1) {
        // Single farm - center on it
        const farm = this.farmsWithCoordinates[0];
        this.center = {
          lat: parseFloat(farm.latitude),
          lng: parseFloat(farm.longitude)
        };
        this.zoom = 16;
        console.log('Centered on farm:', farm.name, 'at', this.center);
        
        this.$swal({
          icon: 'success',
          title: 'Farm Located',
          text: `Centered on ${farm.name || 'Farm ' + farm.id}`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Multiple farms - fit bounds to show all
        // For now, just center on first and zoom out
        const firstFarm = this.farmsWithCoordinates[0];
        this.center = {
          lat: parseFloat(firstFarm.latitude),
          lng: parseFloat(firstFarm.longitude)
        };
        this.zoom = 12;
        
        this.$swal({
          icon: 'info',
          title: 'Farms Located',
          text: `Showing ${this.farmsWithCoordinates.length} farms`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  }
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map-wrapper {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 15px;
  min-width: 250px;
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
}

.legend-header {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.legend-header h5 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #333;
}

.legend-stats {
  color: #666;
  font-size: 0.85rem;
  margin-top: 5px;
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.legend-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.farm-icon {
  background-color: #007bff;
}

.tree-healthy {
  background-color: #28a745;
}

.tree-warning {
  background-color: #ffc107;
}

.tree-critical {
  background-color: #dc3545;
}

.tree-unknown {
  background-color: #808080;
}

.legend-actions {
  border-top: 1px solid #e9ecef;
  padding-top: 15px;
}

.info-window {
  padding: 5px;
  min-width: 200px;
}

.info-window h6 {
  margin: 0 0 8px 0;
  color: #333;
}

.info-window p {
  margin: 4px 0;
  color: #666;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-overlay p {
  color: #333;
  font-weight: 500;
}

.api-key-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3000;
  max-width: 600px;
  width: 90%;
}

.api-key-error .alert {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .map-legend {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: calc(100% - 20px);
  }
}
</style>

