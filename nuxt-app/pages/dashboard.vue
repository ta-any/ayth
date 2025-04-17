<template>
  <div class="dashboard">
    <h1>Welcome, {{ user?.username }}!</h1>
    <button class="btn-exit" @click="handleLogout">Выход</button>
  </div>
  <div class="data-table-container">
    <Table />
  </div>

</template>

<script setup lang="ts">
import Table from "~/components/table_order.vue";
import { useState } from '#app';
import { navigateTo } from '#app';

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

const user = useState<User>('user');

const handleLogout = (): void => {
  user.value = null;
  localStorage.removeItem('user');
  navigateTo('/login');
};
</script>