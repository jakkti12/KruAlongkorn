// server/api/login.js
export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  if (username === '123' && password === '123') {
    // เก็บ session เมื่อ login สำเร็จ
    return { success: true, message: 'Login successful!' };
  } else {
    return { success: false, message: 'Invalid credentials' };
  }
});
