<script setup></script>

<template>
  <header class="p-4 border-b flex gap-4">
    <router-link to="/">Home</router-link>
    <router-link to="/experience/:slug">Experience</router-link>
    <router-link to="/book/:slug">Book</router-link>
    <router-link to="/cart">Cart</router-link>
  </header>
  <RouterView />
</template>

<style scoped></style>
