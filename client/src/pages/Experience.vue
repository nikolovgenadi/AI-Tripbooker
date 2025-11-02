<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { DataResponse, Experience } from '@/types';

const route = useRoute();
// data arrays
const data = ref<DataResponse>({ experiences: [], articles: [], packages: [] });

// gets slug from the URL params
const slug = computed(() => route.params.slug as string);

// find the specific experience with slug
const experience = computed((): Experience | undefined => {
  return data.value.experiences.find((exp) => exp.slug === slug.value);
});

// get query params for summary (resedatum, personer etc from homepage)
const searchCriteria = computed(() => {
  return {
    search: route.query.search,
    startDate: route.query.startDate,
    adults: route.query.adults,
    children: route.query.children,
    days: route.query.days,
  };
});

// load experience data when component is mounted (added to the DOM)
onMounted(async () => {
  const response = await fetch('/data.json');
  data.value = await response.json();
});
</script>

<template>
  <div class="container mx-auto p-6">
    <!--loading state - if no data -->
    <div v-if="!data.experiences.length" class="text-center py-8">
      <p class="text-gray-600">Loading experience...</p>
    </div>

    <!-- not found - checks if exp is the correct one -->
    <div v-else-if="!experience" class="text-center py-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        Experience Not Found
      </h1>
      <p class="text-gray-600 mb-6">
        Sorry, we couldn't find the experience you're looking for.
      </p>
      <router-link
        to="/"
        class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Back to Home
      </router-link>
    </div>

    <!-- data loaded and correct - run -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- img -->
      <div class="mb-8">
        <img
          :src="experience.image"
          :alt="experience.title"
          class="w-full h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      <!-- experience details from here (grid) -->
      <div class="grid md:grid-cols-3 gap-8">
        <!-- main container for experience details -->
        <div class="md:col-span-2">
          <h1 class="text-4xl font-bold mb-4">{{ experience.title }}</h1>
          <p class="text-xl text-gray-600 mb-6">{{ experience.location }}</p>

          <!-- summary of previous selections (query params) -->
          <div
            v-if="
              searchCriteria.search ||
              searchCriteria.startDate ||
              searchCriteria.adults
            "
            class="bg-gray-50 p-4 rounded-lg mb-6"
          >
            <h3 class="font-semibold mb-2">your search criteria:</h3>
            <div class="text-sm text-gray-700">
              <p v-if="searchCriteria.search">
                Searched for: "{{ searchCriteria.search }}"
              </p>
              <p v-if="searchCriteria.startDate">
                Travel date: {{ searchCriteria.startDate }}
              </p>
              <p v-if="searchCriteria.adults">
                Adults: {{ searchCriteria.adults }}
              </p>
              <p v-if="searchCriteria.children">
                Children: {{ searchCriteria.children }}
              </p>
              <p v-if="searchCriteria.days">
                Duration: {{ searchCriteria.days }} days
              </p>
            </div>
          </div>

          <p class="text-lg text-gray-700 leading-relaxed mb-6">
            {{ experience.teaser }}
          </p>

          <!-- tags -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Experience Highlights</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in experience.tags"
                :key="tag"
                class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- booking sidebar -->
        <div class="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 class="text-xl font-semibold mb-4">Book This Experience</h3>

          <router-link
            :to="{
              path: `/book/${experience.slug}`,
              query: searchCriteria,
            }"
            class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-center block"
          >
            Book Now
          </router-link>

          <router-link
            to="/"
            class="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
          >
            Back to Experiences
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
