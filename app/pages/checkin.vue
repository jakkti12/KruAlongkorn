<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-body">
        <h2>เช็คชื่อสแกนหน้า</h2>
        <div>
          <hr>
          <button @click="runPythonScript" class="btn btn-primary">Check in</button>
          <p>{{ response }}</p>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const response = ref('');
const isLoggedIn = ref(false);
const router = useRouter();

const runPythonScript = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    // Send a POST request to the server with the token
    const res = await $fetch('http://localhost:7000/run-checkin', { 
      method: 'POST',
      body: JSON.stringify({ token }), // Convert the body to a JSON string
      headers: {
        'Content-Type': 'application/json' // Specify that the content type is JSON
      }
    });
    
    // Assuming the server sends back an 'output' field in the response
    if (res && res.output) {
      response.value = res.output;  // Update the response value with the output from the server
    } else {
      console.error('No output found in the response');
    }
  } catch (error) {
    console.error('Error running Python script:', error);
  }
};

const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;

  if (!isLoggedIn.value) {
    router.push('/auth/login'); // Redirect to the login page if not logged in
  }
};

onMounted(() => {
  checkLoginStatus();
});
</script>
