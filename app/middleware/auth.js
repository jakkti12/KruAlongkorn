export default function ({ store, redirect }) {
  if (!process.client) return;

  const token = localStorage.getItem('token');
  if (!token) {
    return redirect('/login');
  }
}
