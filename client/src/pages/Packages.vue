<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import type { DataResponse, Package } from '@/types';

const data = ref<DataResponse>({ packages: [], articles: [], experiences: [] });
const cartStore = useCartStore();
const router = useRouter();

// load packages data
onMounted(async () => {
  const response = await fetch('/data.json');
  data.value = await response.json();
});

// add package to cart function
function addPackageToCart(pkg: Package) {
  cartStore.addPackage({
    packageId: pkg.id,
    packageTitle: pkg.title,
    price: pkg.price,
    duration: pkg.duration,
    type: pkg.type,
    includes: pkg.includes,
  });
  // redirect to cart page
  router.push('/cart');
}
</script>

<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-semibold mb-4">Package Deals</h2>

    <!-- standalone packages -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Complete Packages</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="pkg in data.packages.filter((p) => p.type === 'standalone')"
          :key="pkg.id"
          class="border border-gray-300 rounded-lg overflow-hidden shadow-md"
        >
          <img
            :src="pkg.image"
            :alt="pkg.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h4 class="font-bold text-lg mb-2">{{ pkg.title }}</h4>
            <p class="text-gray-600 mb-2">{{ pkg.description }}</p>
            <p class="text-gray-800 mb-2">Duration: {{ pkg.duration }}</p>
            <p class="text-blue-600 font-bold mb-4">{{ pkg.price }} SEK</p>

            <div class="mb-4">
              <h5 class="font-semibold text-sm mb-1">Includes:</h5>
              <ul class="text-sm text-gray-600">
                <li v-for="item in pkg.includes" :key="item">• {{ item }}</li>
              </ul>
            </div>

            <button
              @click="addPackageToCart(pkg)"
              class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Book Package
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- addon packages -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Add-ons</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="pkg in data.packages.filter((p) => p.type === 'addon')"
          :key="pkg.id"
          class="border border-gray-300 rounded-lg overflow-hidden shadow-md"
        >
          <img
            :src="pkg.image"
            :alt="pkg.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h4 class="font-bold text-lg mb-2">{{ pkg.title }}</h4>
            <p class="text-gray-600 mb-2">{{ pkg.description }}</p>
            <p class="text-blue-600 font-bold mb-4">{{ pkg.price }} SEK</p>

            <div class="mb-4">
              <h5 class="font-semibold text-sm mb-1">Includes:</h5>
              <ul class="text-sm text-gray-600">
                <li v-for="item in pkg.includes" :key="item">• {{ item }}</li>
              </ul>
            </div>

            <button
              @click="addPackageToCart(pkg)"
              class="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add to Booking
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- articles section -->
    <div>
      <h3 class="text-xl font-semibold mb-4">Travel Tips</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="article in data.articles"
          :key="article.id"
          class="border border-gray-300 p-4 rounded-lg shadow-md"
        >
          <h4 class="font-bold text-lg mb-2">{{ article.title }}</h4>
          <p class="text-gray-600">{{ article.body }}</p>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
