<template>
    <div>
      <form @submit.prevent="register">
        <div>
          <label for="username">Staff ID:</label>
          <input type="text" v-model="username" id="staffId" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const username = ref('')
  
  const register = async () => {
    try {
      const response = await $fetch('http://localhost:7000/run-register', {
        method: 'POST',
        body: { username: username.value }
      })
  
      if (response.ok) {
        alert('Registration successful!')
      } else {
        alert('Registration failed: ' + response.error)
      }
    } catch (error) {
      console.error('Error during registration:', error)
      alert('An error occurred during registration.')
    }
  }
  </script>
  