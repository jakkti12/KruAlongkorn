<template>
    <div>
      <HeaderComponent />
      <main>
        <NuxtPage />
      </main>
      <!-- คุณสามารถเพิ่ม Footer ได้ที่นี่ -->
    </div>
  </template>
  
  <script setup>
  import HeaderComponent from '~/components/HeaderComponent.vue'
  </script>
  
  <style>
  /* คุณสามารถใส่สไตล์สำหรับ Layout ได้ที่นี่ */
  main {
    padding: 0px;
  }
  </style>
  