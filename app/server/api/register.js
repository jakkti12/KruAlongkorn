// server/api/register.js
export default defineEventHandler(async (event) => {
    const { username, password, confirmpassword} = await readBody(event);

    if (password === confirmpassword) {
      // เก็บ session เมื่อ login สำเร็จ
      return { success: true, message: 'Register successful!' };
    }
});
  