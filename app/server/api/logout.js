// server/api/logout.js
export default defineEventHandler(async (event) => {
    event.req.session.destroy((err) => {
      if (err) {
        return { success: false, message: 'Logout failed' };
      }
    });
  
    return { success: true, message: 'Logged out successfully' };
  });
  