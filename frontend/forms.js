// Signup Form Handler
const signupForm = document.querySelector('.auth-form');
if (signupForm && document.getElementById('fname')) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('pnumber').value;
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;

    if (password1 !== password2) {
      alert('Passwords do not match!');
      return;
    }

    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname: fname, lastname: lname, username, email, phone, password: password1 })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Account created successfully!');
      window.location.href = 'login.html';
    } else {
      alert('Error: ' + data.error);
    }
  });
}

// Login Form Handler
if (signupForm && document.getElementById('login_mail')) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login_mail').value;
    const password = document.getElementById('login_password').value;

    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Login successful!');
      window.location.href = 'main.html';
    } else {
      alert('Error: ' + data.error);
    }
  });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('cname').value;
    const email = document.getElementById('cemail').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Message sent!');
      contactForm.reset();
    } else {
      alert('Error: ' + data.error);
    }
  });
}
