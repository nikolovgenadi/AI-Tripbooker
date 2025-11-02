<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import type { DataResponse, Experience, Package } from '@/types';

// get url parameter and router
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

// data and experience loading (similar to experience.vue)
const data = ref<DataResponse>({ experiences: [], articles: [], packages: [] });
const slug = computed(() => route.params.slug as string);
const experience = computed((): Experience | undefined => {
  return data.value.experiences.find((exp) => exp.slug === slug.value);
});

// get add-on packages
const addonPackages = computed((): Package[] => {
  return data.value.packages.filter((pkg) => pkg.type === 'addon');
});

// form state - just basic inputs for now
const startDate = ref('');
const adults = ref(1);
const children = ref(0);
const days = ref(1);
const selectedAddons = ref<number[]>([]);

// load experience data
onMounted(async () => {
  const response = await fetch('/data.json');
  data.value = await response.json();

  // load values from query params if they exist
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

// simple price calculation
const totalPeople = computed(() => adults.value + children.value);
const pricePerPerson = ref(1200); // just hardcoded for now

// calculate addon prices
const addonTotalPrice = computed(() => {
  return selectedAddons.value.reduce((total, addonId) => {
    const addon = addonPackages.value.find((pkg: any) => pkg.id === addonId);
    return total + (addon ? addon.price : 0);
  }, 0);
});

const totalPrice = computed(
  () =>
    pricePerPerson.value * totalPeople.value * days.value +
    addonTotalPrice.value
);

// toggle addon selection
function toggleAddon(addonId: number) {
  const index = selectedAddons.value.indexOf(addonId);
  if (index > -1) {
    selectedAddons.value.splice(index, 1);
  } else {
    selectedAddons.value.push(addonId);
  }
}

// form submission - just basic for now
function addToCart() {
  if (!experience.value || !startDate.value) {
    alert('please fill required fields');
    return;
  }

  // add experience to cart
  cartStore.addExperience({
    experienceSlug: experience.value.slug,
    experienceTitle: experience.value.title,
    startDate: startDate.value,
    adults: adults.value,
    children: children.value,
    days: days.value,
    pricePerPerson: pricePerPerson.value,
  });

  // add selected addon packages to cart
  selectedAddons.value.forEach((addonId) => {
    const addon = addonPackages.value.find((pkg: any) => pkg.id === addonId);
    if (addon) {
      cartStore.addPackage({
        packageId: addon.id,
        packageTitle: addon.title,
        price: addon.price,
        duration: addon.duration,
        type: addon.type,
        includes: addon.includes,
      });
    }
  });

  // redirect to cart
  router.push('/cart');
}
</script>

<template>
  <div class="container mx-auto p-6">
    <div v-if="experience" class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">{{ experience.title }}</h1>
      <p class="text-gray-600 mb-6">{{ experience.location }}</p>

      <img
        :src="experience.image"
        :alt="experience.title"
        class="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
      />

      <form @submit.prevent="addToCart" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Start date:</label>
          <input
            type="date"
            v-model="startDate"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Adults:</label>
          <input
            type="number"
            v-model.number="adults"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Children (0-12):</label>
          <input
            type="number"
            v-model.number="children"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Duration (days):</label>
          <input
            type="number"
            v-model.number="days"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- addon packages section -->
        <div v-if="addonPackages.length > 0" class="border-t pt-4">
          <h3 class="text-lg font-semibold mb-3">Add-on Packages</h3>
          <p class="text-sm text-gray-600 mb-4">Optional add-ons:</p>

          <div class="space-y-3">
            <div
              v-for="addon in addonPackages"
              :key="addon.id"
              class="border border-gray-200 rounded-lg p-3"
            >
              <label class="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  :value="addon.id"
                  @change="toggleAddon(addon.id)"
                  class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium">{{ addon.title }}</h4>
                      <p class="text-sm text-gray-600">
                        {{ addon.description }}
                      </p>
                      <ul class="text-xs text-gray-500 mt-1">
                        <li v-for="include in addon.includes" :key="include">
                          • {{ include }}
                        </li>
                      </ul>
                    </div>
                    <span class="text-blue-600 font-semibold"
                      >{{ addon.price }} SEK</span
                    >
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-lg mb-2">Booking summary</h3>
          <p class="text-gray-700">
            {{ totalPeople }} people for {{ days }} days
          </p>
          <div
            v-if="selectedAddons.length > 0"
            class="text-sm text-gray-600 mt-1"
          >
            <p>Add-ons: {{ selectedAddons.length }} selected</p>
          </div>
          <p class="text-xl font-bold text-blue-600">
            Total: {{ totalPrice }} SEK
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add to cart
        </button>
      </form>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-600">Experience not found</p>
    </div>
  </div>
</template>
