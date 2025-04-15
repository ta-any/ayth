<template>
  <div>
    <h1>Welcome, {{ user?.username }}!</h1>
    <p>Email: {{ user?.email }}</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
const user = useState('user')

// Redirect if not logged in
if (!user.value) {
  navigateTo('/login')
}

const handleLogout = () => {
  useState('user', () => null)
  navigateTo('/login')
}
</script>