import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import bootstrap from 'bootstrap';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '@popperjs/core';

const app = createApp(App).use(router).use(VueSweetalert2).use(bootstrap);

app.provide('baseUrl', 'http://127.0.0.1:8000/api');

app.mount('#app');

// Login function
function login(email, password) {
  return axios.post(this.baseUrl + "/login", {
    email: email,
    password: password
  })
  .then(response => {
    // success...
  })
  .catch(error => {
    console.error('Axios error object:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
      // If Laravel validation errors:
      if (error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        const flat = Object.values(errors).flat().join('\n');
        // show to user
        this.$swal({ icon: 'error', title: 'Validation error', text: flat });
      } else {
        this.$swal({ icon: 'error', title: 'Login failed', text: error.response.data.message || 'Check server response' });
      }
    } else {
      // network / no response
      console.error(error.message);
      this.$swal({ icon: 'error', title: 'Network error', text: error.message });
    }
  });
}
