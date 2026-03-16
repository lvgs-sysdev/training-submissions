document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profile-edit-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
  const res = await fetch('/api/update-user', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const data = await res.json();
    let msgBox = form.parentElement.querySelector('.success-msg, .error-msg');
    if (msgBox) msgBox.remove();
    if (data.success) {
      const div = document.createElement('div');
      div.className = 'success-msg';
      div.textContent = 'プロフィールを更新しました。';
      form.parentElement.insertBefore(div, form);
    } else {
      const div = document.createElement('div');
      div.className = 'error-msg';
      div.textContent = data.error || '更新に失敗しました。';
      form.parentElement.insertBefore(div, form);
    }
  });
});
