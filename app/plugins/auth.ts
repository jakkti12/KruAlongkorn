import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  const auth = {
    loggedIn: false, // สถานะล็อกอินเริ่มต้น

    // ฟังก์ชันการเข้าสู่ระบบ
    login(token: string) {
      this.loggedIn = true
      // บันทึก token หรือทำการจัดการอื่น ๆ
    },

    // ฟังก์ชันการออกจากระบบ
    logout() {
      this.loggedIn = false
      // ลบ token หรือทำการจัดการอื่น ๆ
    }
  }

  // เพิ่ม auth ลงใน context
  nuxtApp.provide('auth', auth)
})
