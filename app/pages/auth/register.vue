<template>
  <div class="container">
    <div class="row text-center mt-5">
      <div class="col">
        <div class="p-2">
          <img style="width: 100px; border-radius: 100%;" src="~/assets/images/logo.png" alt="Logo" />
        </div>
        <h2>สมัครสมาชิก</h2>
        <p>
          หรือ
          <a href="/auth/login" class="">ลงชื่อเข้าใช้</a>
        </p>
      </div>
    </div>
    <div class="row mt-5 justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-body">
            <div v-if="error" class="error">{{ error }}</div>
            <form @submit.prevent="register">
              <div class="mb-3">
                <label for="inputUsername" class="form-label">ชื่อผู้ใช้</label>
                <input v-model="username" type="text" class="form-control" id="inputUsername" required />
              </div>
              <div class="mb-3">
                <label for="inputEmail" class="form-label">อีเมล</label>
                <input v-model="email" type="email" class="form-control" id="inputEmail" required />
              </div>
              <div class="mb-3">
                <label for="inputPassword" class="form-label">รหัสผ่าน</label>
                <input v-model="password" type="password" class="form-control" id="inputPassword" required />
              </div>
              <div class="mb-3">
                <label for="inputConfirmPassword" class="form-label">ยืนยันรหัสผ่าน</label>
                <input v-model="confirmPassword" type="password" class="form-control" id="inputConfirmPassword" required />
              </div>
              <button type="submit" class="btn btn-primary w-100 mt-3">สมัครสมาชิก</button>
            </form>
            <hr />
            <div class="text-center">
              <a href="/" class="link-secondary">กลับสู่หน้าหลัก</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref(null)
const router = useRouter()

const register = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'หรือรหัสผ่านไม่ตรงกัน'
    return
  }

  try {
    const response = await $fetch('http://localhost:7000/run-register', {
      method: 'POST',
      body: {
        username: username.value,
        email: email.value,
        password: password.value
      }
    })

    if (response.ok) {
      alert('Registration successful!')
      router.push('/auth/login')
    } else {
      alert('Registration failed: ' + response.error)
    }
  } catch (error) {
    console.error('Error during registration:', error)
    alert('An error occurred during registration.')
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
