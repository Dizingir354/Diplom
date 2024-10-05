document.getElementById('registrationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  fetch('/api/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      if (data.message === 'Пользователь зарегистрирован. Код подтверждения отправлен на почту.') {
          alert(data.message);
          document.getElementById('registrationForm').style.display = 'none';
          document.getElementById('verificationSection').style.display = 'block';
      } else {
          alert(data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

document.getElementById('verificationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const verificationCode = document.getElementById('verificationCode').value;

  fetch('/api/verify-email', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, verificationCode })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      if (data.message === 'Email успешно подтвержден.') {
          alert(data.message);
          window.location.href = '/login.html';  // Перенаправление на страницу входа
      } else {
          alert(data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});
