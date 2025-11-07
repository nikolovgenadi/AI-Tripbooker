<script setup lang="ts">
import { ref } from 'vue';
import { getTravelRecommendations } from '@/services/aiService';

const destination = ref('');
const interests = ref('');
const budget = ref('5000');
const recommendations = ref('');
const loading = ref(false);
const error = ref('');

async function getRecommendations() {
  loading.value = true;
  error.value = '';
  recommendations.value = '';

  try {
    const result = await getTravelRecommendations(
      destination.value,
      interests.value,
      budget.value
    );
    recommendations.value = result;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">AI Travel Recommendations</h1>
    <h3 class="text-1xl mb-6">
      Generated recommendations can be wrong, please verify with other sources.
    </h3>
    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="getRecommendations" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Destination</label>
          <input
            v-model="destination"
            type="text"
            required
            placeholder="e.g., Stockholm, Paris, Tokyo"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2"
            >Interests (optional)</label
          >
          <input
            v-model="interests"
            type="text"
            placeholder="e.g., history, food, art, nature"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Budget (SEK)</label>
          <input
            v-model="budget"
            type="text"
            placeholder="e.g., 5000"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          :class="[
            'w-full text-white py-3 rounded-lg disabled:opacity-50',
            loading
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600',
          ]"
        >
          {{
            loading ? 'Getting AI Recommendations...' : 'Get AI Recommendations'
          }}
        </button>
      </form>

      <!-- AI response in list -->
      <div v-if="recommendations" class="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold mb-3">AI Recommendations:</h3>
        <div class="whitespace-pre-wrap text-gray-800">
          {{ recommendations }}
        </div>
      </div>

      <div
        v-if="error"
        class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>
