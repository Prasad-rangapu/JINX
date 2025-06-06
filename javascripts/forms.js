// Signup form handler
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    fname: document.getElementById('fname').value,
    lname: document.getElementById('lname').value,
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    pnumber: document.getElementById('pnumber').value,
    password1: document.getElementById('password1').value,
    password2: document.getElementById('password2').value
  };

  if (formData.password1 !== formData.password2) {
    alert('Passwords do not match!');
    return;
  }

  try {
  
    const response = await fetch('https://jinx-backend.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (data.success) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token); // <-- Store JWT
      window.location.href = `home.html`;
    } else {
      alert('Signup failed: ' + (data.error || 'Unknown error'));
    }

  } catch (error) {
    // console.error('Signup error:', error);
    alert('Connection failed');
    console.log('try not worked');
  }
});

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    email: document.getElementById('login_mail').value,
    password: document.getElementById('login_password').value
  };

  try {
    const response = await fetch('https://jinx-backend.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // <-- Add this if you use sessions/cookies
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (data.success) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token); // <-- Store JWT token
      window.location.href = `home.html`;
    } else {
      alert('Login failed: ' + (data.error || 'Invalid credentials'));
    }

  } catch (error) {
    console.error('Login error:', error);
    alert('Connection failed');
  }
});



//added contact form handler
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    cname:document.getElementById('cname').value,
   cemail: document.getElementById('cemail').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  if (formData.cname === '' || formData.cemail === '' || formData.subject === '' || formData.message === '') {
    alert('Please fill in all fields!');
 
    return;
  }

  try {
  
    const response = await fetch('https://jinx-backend.onrender.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    if (data.success) {
      alert('Message sent successfully!');
      window.location.href = `home.html`;
    } else {
      alert('Message failed: ' + (data.error || 'Unknown error'));
    }

 
  } catch (error) {
    console.error('Contact error:', error);
    alert('Connection failed');
  }
});
