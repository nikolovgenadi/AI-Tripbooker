<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const error = ref('');

const isFormValid = computed(() => {
  return (
    form.value.password === form.value.confirmPassword &&
    form.value.password.length >= 6 &&
    form.value.name.trim() &&
    form.value.email.trim()
  );
});

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Please check your form inputs';
    return;
  }

  error.value = '';

  const result = await authStore.register(
    form.value.name,
    form.value.email,
    form.value.password
  );

  if (result.success) {
    router.push('/');
  } else {
    error.value = result.error || 'Registration failed';
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Login
          </router-link>
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="e.g. Johnny Depp"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="e.g. johnnydepp@gmail.com"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
              >Confirm Password</label
            >
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
