import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login admin user
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise} API response with token and user data
   */
  async login(email, password) {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      // Store token and user data
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout current user**/
  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem("auth_token");
  }

  /**
   * Get current user data
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get auth token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem("auth_token");
  }
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return new Error(
        error.response.data?.message ||
          error.response.data?.error ||
          "An error occurred. Please try again."
      );
    } else if (error.request) {
      // Request made but no response
      return new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      return new Error(error.message || "An unexpected error occurred.");
    }
  }

  // In AuthService
  async refreshToken() {
    try {
      const response = await api.post("/refresh-token");
      localStorage.setItem("auth_token", response.data.token);
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();
