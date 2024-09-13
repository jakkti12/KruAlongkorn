<template>
  <header>
    <nav class="navbar custom-navbar bg-light p-0">
      <div class="container justify-content-between justify-sm-content-start">
        <a class="navbar-brand" href="/">
          <img style="width: 60px; border-radius: 100%;" src="~/assets/images/logo.png" alt="Resume Kit" />
        </a>
        <button class="navbar-toggler m-2 d-sm-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-start d-block d-sm-none" id="navbarMenu">
          <ul class="list-group">
            <li class="list-group-item fw-bold">เมนูหลัก</li>
            <li>
              <a class="list-group-item" href="/"><i class="bi-house"></i> หน้าหลัก</a>
            </li>
            <li>
              <a class="list-group-item" href="#"><i class="bi-info-circle"></i> ประวัติผู้จัดทํา</a>
            </li>
          </ul>
        </div>

        <div class="d-none d-sm-flex flex-grow-1">
          <ul class="nav flex-row">
            <li class="nav-item">
              <a href="/" class="nav-link custom-nav-link">หน้าหลัก</a>
            </li>
            <li class="nav-item">
              <a href="/about-me" class="nav-link custom-nav-link">ประวัติผู้จัดทํา</a>
            </li>
            <li class="nav-item">
              <a href="/check_in" class="nav-link custom-nav-link">ตารางตรวจเช็ค</a>
            </li>
          </ul>
          <ul class="nav flex-row ms-auto">
            <li v-if="!isLoggedIn" class="nav-item">
              <a href="/auth/login" class="nav-link custom-nav-link">เข้าสู่ระบบ</a>
            </li>
            <li v-if="!isLoggedIn" class="nav-item">
              <a href="/auth/register" class="nav-link custom-nav-link">สมัครสมาชิก</a>
            </li>
            <li v-if="isLoggedIn" class="nav-item">
              <a href="#" class="nav-link custom-nav-link" @click="logout">ออกจากระบบ</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const isLoggedIn = ref(false)
const router = useRouter()
const route = useRoute()

const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
}

const logout = async () => {
  try {
    const response = await axios.post('http://localhost:7000/logout');
    localStorage.removeItem('token');
    isLoggedIn.value = false;
    router.push('/');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

onMounted(() => {
  checkLoginStatus();
});

// Watch for route changes
watch(route, () => {
  checkLoginStatus();
});
</script>

<style>
.custom-navbar {
  background-color: #004080 !important;
}

.custom-nav-link {
  color: #ffffff !important;
}

.custom-nav-link:hover {
  color: #cccccc !important;
}
</style>
