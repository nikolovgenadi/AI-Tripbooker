import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCartStore } from './cart';

export interface User {
  id: number;
  email: string;
  name: string;
}

export const useAuthStore = defineStore('auth', () => {
  // states
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const initAuth = () => {
    // check if user is logged in from local storage
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // updating store state
      token.value = data.token;
      user.value = data.user;

      // save to local storage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    loading.value = true;
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // updating store state
      token.value = data.token;
      user.value = data.user;

      // save to local storage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    // clear store state
    user.value = null;
    token.value = null;

    // clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Clear cart when user logs out
    const cartStore = useCartStore();
    cartStore.clearCart();
  };

  const getAuthHeaders = () => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  };

  return {
    // states
    user,
    token,
    loading,

    isAuthenticated,

    // actions
    initAuth,
    login,
    register,
    logout,
    getAuthHeaders,
  };
});
