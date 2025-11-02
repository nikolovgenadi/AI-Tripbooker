import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItem {
  experienceSlug: string;
  experienceTitle: string;
  startDate: string;
  adults: number;
  children: number;
  days: number;
  pricePerPerson: number;
}

export interface PackageItem {
  packageId: number;
  packageTitle: string;
  price: number;
  duration: string;
  type: 'standalone' | 'addon';
  includes: string[];
}

export const useCartStore = defineStore(
  'cart',
  () => {
    // separate arrays for different item types
    const experienceItems = ref<CartItem[]>([]);
    const packageItems = ref<PackageItem[]>([]);

    // computed values (auto-calculated when items change)
    const totalItems = computed(
      () => experienceItems.value.length + packageItems.value.length
    );

    const totalPrice = computed(() => {
      // calculate experience costs
      const experienceCost = experienceItems.value.reduce((total, item) => {
        const peopleCount = item.adults + item.children;
        return total + item.pricePerPerson * peopleCount * item.days;
      }, 0);

      // calculate package costs
      const packageCost = packageItems.value.reduce((total, pkg) => {
        return total + pkg.price;
      }, 0);

      return experienceCost + packageCost;
    });

    // actions for experiences
    function addExperience(item: CartItem) {
      experienceItems.value.push(item);
    }

    function removeExperience(index: number) {
      experienceItems.value.splice(index, 1);
    }

    // actions for packages
    function addPackage(item: PackageItem) {
      packageItems.value.push(item);
    }

    function removePackage(index: number) {
      packageItems.value.splice(index, 1);
    }

    function clearCart() {
      experienceItems.value = [];
      packageItems.value = [];
    }

    return {
      // state (the data)
      experienceItems,
      packageItems,
      // computed (auto calculated values)
      totalItems,
      totalPrice,
      // actions (functions that change cart)
      addExperience,
      removeExperience,
      addPackage,
      removePackage,
      clearCart,
    };
  },
  {
    persist: true,
  }
);
