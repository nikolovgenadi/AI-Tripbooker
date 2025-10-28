<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';

const data = ref({ experiences: [], articles: [] });
const searchQuery = ref('');

onMounted(async () => {
  const response = await fetch('/data.json');
  data.value = await response.json();
});

const filteredExperiences = computed(() => {
  if (!searchQuery.value) {
    return data.value.experiences;
  }

  const query = searchQuery.value.toLowerCase();
  return data.value.experiences.filter(
    (experience) =>
      experience.title.toLowerCase().includes(query) ||
      experience.location.toLowerCase().includes(query) ||
      experience.teaser.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="mb-8">
      <div class="max-w-md mx-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search experiences by location, title, or description..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <h2 class="text-2xl font-semibold mb-4">Travel Experiences</h2>
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
            :to="`/experience/${experience.slug}`"
            class="bg-black text-white px-4 py-2 rounded hover:bg-blue-900"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>

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
