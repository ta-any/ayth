<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">

        <label for="username">Email:</label>
        <p class="example_email">Например: david.jones@creds.com</p>
        <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="Enter your email"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter your password"
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { navigateTo, useState, useFetch } from '#imports';

interface UserCredentials {
  username: string;
  passphrase: string;
}

interface User {
  name: string;
  surname: string;
  credentials: UserCredentials;
  active: boolean;
  created: string;
  _comment?: string;
}

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  user: User;
}

const form = ref<LoginForm>({
  username: '',
  password: ''
});

onMounted(() => {
  const user = useState<User | null>('user');
  const userFromStorage = localStorage.getItem('user');

  if (user.value || userFromStorage) {
    navigateTo('/dashboard');
  }
});

const loading = ref<boolean>(false);
const error = ref<string>('');

const handleLogin = async (): Promise<void> => {
  error.value = '';
  loading.value = true;

  try {
    const response = await $fetch<LoginResponse>('/api/login', {
      method: 'POST',
      body: form.value
    });
    console.log(response);

    const userData = response.user;
    useState('user', () => userData);
    localStorage.setItem('user', JSON.stringify(userData));

    await navigateTo('/dashboard', { replace: true });

  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
    form.value.username = '';
    form.value.password = '';
  }
};
</script>
<style></style>
