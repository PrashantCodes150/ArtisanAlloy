// Debug script to test authentication flow
// Run this in browser console after login

window.debugAuth = {
  // Check current auth state
  checkAuthState() {
    console.log('=== Authentication State ===');
    console.log('Access Token:', localStorage.getItem('accessToken') ? '✓ Present' : '✗ Missing');
    console.log('Refresh Token:', localStorage.getItem('refreshToken') ? '✓ Present' : '✗ Missing');
    console.log('User Data:', localStorage.getItem('user') ? '✓ Present' : '✗ Missing');
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token Payload:', payload);
        console.log('Token Expires:', new Date(payload.exp * 1000));
        console.log('Token Valid:', payload.exp * 1000 > Date.now());
      } catch (e) {
        console.error('Invalid token format:', e);
      }
    }
  },

  // Test API call
  async testApiCall() {
    console.log('=== Testing API Call ===');
    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('Response Status:', response.status);
      console.log('Response Headers:', [...response.headers.entries()]);
      
      const data = await response.json();
      console.log('Response Data:', data);
      
      return { success: response.ok, data };
    } catch (error) {
      console.error('API Call Failed:', error);
      return { success: false, error };
    }
  },

  // Test cart API
  async testCartApi() {
    console.log('=== Testing Cart API ===');
    try {
      const response = await fetch('/api/v1/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('Cart Response Status:', response.status);
      const data = await response.json();
      console.log('Cart Response Data:', data);
      
      return { success: response.ok, data };
    } catch (error) {
      console.error('Cart API Failed:', error);
      return { success: false, error };
    }
  },

  // Test wishlist API
  async testWishlistApi() {
    console.log('=== Testing Wishlist API ===');
    try {
      const response = await fetch('/api/v1/wishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('Wishlist Response Status:', response.status);
      const data = await response.json();
      console.log('Wishlist Response Data:', data);
      
      return { success: response.ok, data };
    } catch (error) {
      console.error('Wishlist API Failed:', error);
      return { success: false, error };
    }
  },

  // Clear all auth data
  clearAuth() {
    console.log('=== Clearing Auth Data ===');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('Auth data cleared');
  },

  // Check service worker status
  checkServiceWorker() {
    console.log('=== Service Worker Status ===');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('Service Workers:', registrations.length);
        registrations.forEach(registration => {
          console.log('SW Scope:', registration.scope);
          console.log('SW Active:', registration.active?.state);
        });
      });
    } else {
      console.log('Service Worker not supported');
    }
  },

  // Unregister service worker
  unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          console.log('Service Worker unregistered');
        });
      });
    }
  }
};

console.log('Debug functions loaded. Use window.debugAuth.checkAuthState() to start.');