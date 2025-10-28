<script setup></script>

<template>
  <header class="border-b bg-white shadow-sm">
    <div class="max-w-4xl mx-auto px-6 py-4">
      <nav class="flex items-center justify-center">
        <div class="flex items-center space-x-8">
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
            Cart
          </router-link>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped></style>
