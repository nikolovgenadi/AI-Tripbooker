<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { DataResponse } from '@/types';

// get route and router for query params
const route = useRoute();
const router = useRouter();

const data = ref<DataResponse>({ experiences: [], articles: [], packages: [] });

// search criteria for user filtering
const searchQuery = ref('');
const startDate = ref('');
const adults = ref(1);
const children = ref(0);
const days = ref(1);

// load search from url query params
onMounted(async () => {
  const response = await fetch('/data.json');
  data.value = await response.json();

  // load all search criteria from url if exists
  if (route.query.search) {
    searchQuery.value = route.query.search as string;
  }
  if (route.query.startDate) {
    startDate.value = route.query.startDate as string;
  }
  if (route.query.adults) {
    adults.value = parseInt(route.query.adults as string);
  }
  if (route.query.children) {
    children.value = parseInt(route.query.children as string);
  }
  if (route.query.days) {
    days.value = parseInt(route.query.days as string);
  }
});

// update url when any search criteria changes
watch([searchQuery, startDate, adults, children, days], () => {
  const query: any = {};
  if (searchQuery.value) query.search = searchQuery.value;
  if (startDate.value) query.startDate = startDate.value;
  if (adults.value > 1) query.adults = adults.value;
  if (children.value > 0) query.children = children.value;
  if (days.value > 1) query.days = days.value;

  router.push({ query });
});

// filter experiences based on search criteria
const filteredExperiences = computed(() => {
  let results = data.value.experiences;

  // filter by text search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (experience) =>
        experience.title.toLowerCase().includes(query) ||
        experience.location.toLowerCase().includes(query) ||
        experience.teaser.toLowerCase().includes(query)
    );
  }
  return results;
});

// computed values for display
const totalPeople = computed(() => adults.value + children.value);
</script>

<template>
  <div class="container mx-auto p-6">
    <!-- search criteria form -->
    <div class="mb-8">
      <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Find your perfect experience</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <!-- text search -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium mb-1"
              >Search experiences:</label
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="northern lights, archipelago..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- travel date -->
          <div>
            <label class="block text-sm font-medium mb-1">Travel date:</label>
            <input
              v-model="startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- adults -->
          <div>
            <label class="block text-sm font-medium mb-1">Adults:</label>
            <input
              v-model.number="adults"
              type="number"
              min="1"
              placeholder="0"
              class="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- children -->
          <div>
            <label class="block text-sm font-medium mb-1">Children:</label>
            <input
              v-model.number="children"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- duration -->
          <div>
            <label class="block text-sm font-medium mb-1">Duration:</label>
            <select
              v-model="days"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 day</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="5">5 days</option>
              <option value="7">1 week</option>
            </select>
          </div>
        </div>
      </div>

      <!-- search summary -->
      <div
        v-if="startDate || adults > 1 || children > 0 || days > 1"
        class="mt-4 p-3 bg-blue-50 rounded-md"
      >
        <p class="text-sm text-blue-700">
          Searching for: {{ totalPeople }} People
          <span v-if="startDate">, Starting {{ startDate }}</span>
          <span v-if="days > 1">, for {{ days }} days</span>
        </p>
      </div>
    </div>

    <!-- filtered experiences # -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold mb-4">
        Available experiences
        <span
          v-if="filteredExperiences.length !== data.experiences.length"
          class="text-lg text-gray-600"
        >
          ({{ filteredExperiences.length }} of {{ data.experiences.length }})
        </span>
      </h2>
    </div>
    <!-- filtered experiences container -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="experience in filteredExperiences"
        :key="experience.slug"
        class="border border-gray-300 rounded-lg overflow-hidden shadow-md"
      >
        <img
          :src="experience.image"
          :alt="experience.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="font-bold text-lg mb-2">{{ experience.title }}</h3>
          <p class="text-gray-600 mb-4">{{ experience.teaser }}</p>
          <p class="text-gray-600 mb-4">{{ experience.location }}</p>
          <router-link
            :to="{
              path: `/experience/${experience.slug}`,
              query: {
                search: searchQuery || undefined,
                startDate: startDate || undefined,
                adults: adults > 1 ? adults : undefined,
                children: children > 0 ? children : undefined,
                days: days > 1 ? days : undefined,
              },
            }"
            class="bg-black text-white px-4 py-2 rounded hover:bg-blue-900"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>

    <!-- articles -->
    <h2 class="text-2xl font-semibold mt-10 mb-4">Travel Articles</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="article in data.articles"
        :key="article.id"
        class="border-bt border-gray-300 p-4 rounded-lg overflow-hidden shadow-md"
      >
        <h3 class="font-bold text-lg mb-2">{{ article.title }}</h3>
        <p class="text-gray-600">{{ article.body }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
