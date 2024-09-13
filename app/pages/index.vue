<template>
  <section class="main-banner">
      <div class="content">
          <h1>ระบบเช็คชื่อสแกนหน้า ประจําวัน</h1>
          <p>ให้บริการเช็คชื่อสแกนหน้าประจําวันเช็คชื่อเข้า ภายในเวลา 8 โมงเช้า ถึง 9 โมงเช้า</p>
          <p>และ ให้บริการเช็คชื่อออก ภายในเวลา 17 โมงเย็น 18 โมงเย็น</p>
          <button @click="checkIn">เช็คชื่อ</button>
      </div>
  </section>

  <section class="featured-products">
      <h2>จัดทำโดย</h2>
      <div class="products">
          <div class="product-card">
              <img src="~/assets/images/profile.jpg" alt="Makerbot Replicator Mini 3D Printer">
              <h3>นายจักรกฤษณ์ แก้วบ้านดู่</h3>
              <p>ค่าตัว $999999999 ต่อวัน</p>
          </div>
      </div>
  </section>

    <!-- Services Section -->
    <section class="services">
        <h2>ภาษาและเครื่องมือในการจัดทำ</h2>
        <div class="service-cards">
            <div class="service-card">Python</div>
            <div class="service-card">Javascript</div>
            <div class="service-card">HTML</div>
            <div class="service-card">Bootstrap</div>
            <div class="service-card">Nuxtjs</div>
            <div class="service-card">Nodejs</div>
        </div>
    </section>

    <!-- Footer Section -->
        <div class="footer-content">
            <!-- Footer Links... -->
        </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const checkIn = () => {
    //โค้ดส่วนนี้สำหรับเชื่อมต่อไปยังหน้า เช็คชื่อ แต่ถ้าไม่ได้ login จะทำให้ไปยังหน้า Login
    router.push('/checkin')
}
</script>

<!-- นำเข้าไฟล์ CSS จาก assets/style/homepage.css -->
<style src="~/assets/style/homepage.css"></style>