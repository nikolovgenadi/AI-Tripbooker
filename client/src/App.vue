<script setup>
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

// get cart store for item count(0)
const cartStore = useCartStore();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <header class="border-b bg-white shadow-sm">
    <div class="max-w-4xl mx-auto px-6 py-4">
      <nav class="flex items-center justify-between">
        <!-- menu -->
        <div class="flex-1 flex items-center justify-center space-x-8">
          <router-link
            to="/"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Home
          </router-link>
          <router-link
            to="/packages"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Packages
          </router-link>
          <router-link
            to="/cart"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Cart ({{ cartStore.totalItems }})
          </router-link>
          <router-link
            to="/ai-recommendations"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            AI Recommendations
          </router-link>
        </div>

        <!-- auth options -->
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <button
              @click="handleLogout"
              class="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="rounded hover:text-blue-600 font-medium transition-colors"
            >
              Register
            </router-link>
          </template>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped></style>
