export default defineNuxtPlugin(() => {
    // นำเข้า JavaScript ของ Bootstrap
    import('~/assets/js/bootstrap.bundle.min.js');
  
    // นำเข้าไฟล์ JavaScript ที่กำหนดเอง (custom.js)
    import('~/assets/js/custom.js');
  });
  