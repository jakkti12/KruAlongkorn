<template>
  <div class="container">
    <div class="row text-center mt-5">
      <div class="col">
        <div class="p-2">
          <img style="width: 100px; border-radius: 100%;" src="~/assets/images/logo.png" alt="Logo" />
        </div>
        <h2>ลงชื่อเข้าใช้</h2>
        <p>
          หรือ
          <a href="/auth/register" class="">สมัครสมาชิก</a>
        </p>
      </div>
    </div>
    <div class="row mt-5 justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-body">
            <div v-if="error" class="error">{{ error }}</div>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="inputEmail" class="form-label">ชื่อผู้ใช้</label>
                <input v-model="username" type="text" class="form-control" id="inputEmail" aria-describedby="emailHelp" required/>
              </div>
              <div class="mb-3">
                <label for="inputPassword" class="form-label">รหัสผ่าน</label>
                <input v-model="password" type="password" class="form-control" id="inputPassword" required/>
              </div>
              <div class="d-flex w-100 justify-content-between mb-3">
                <div class="form-check">
                  <input type="checkbox" name="remember" value="1" class="form-check-input" id="checkRememberMe" />
                  <label class="form-check-label" for="checkRememberMe">จดจําฉัน</label>
                </div>
                <div>
                  <a href="#" class="link-primary">ลืมรหัสผ่าน</a>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100">เข้าสู่ระบบ</button>
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

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const error = ref(null);

    // ตรวจสอบ token และเปลี่ยนเส้นทางถ้ามี token
    onMounted(() => {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/');
      }
    });

    const login = async () => {
      try {
        const response = await axios.post('http://localhost:7000/login', {
          username: username.value,
          password: password.value,
        });
        localStorage.setItem('token', response.data.token);
        router.push('/');
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred';
      }
    };

    const checkLogin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          error.value = 'No token found. Please login first.';
          return;
        }

        const response = await axios.get('http://localhost:7000/is_login', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          alert(response.data); // แสดงข้อมูลจากเซิร์ฟเวอร์
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to fetch login status';
      }
    };

    return {
      username,
      password,
      error,
      login,
      checkLogin,
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
