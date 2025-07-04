// Helper to check for HTML/script tags
function checkInput(input) {
  // Returns true if input contains HTML or script tags, false otherwise
  const tagPattern = /<[^>]*>/g;
  return tagPattern.test(input);
}

// Helper to check all fields for HTML/script tags
function hasInvalidInput(obj) {
  for (const key in obj) {
    if (checkInput(obj[key])) {
      return key;
    }
  }
  return null;
}

// Helper to trim all string fields in an object
function trimFields(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    }
  }
}

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

  trimFields(formData);

  // Check for empty fields
  for (const key in formData) {
    if (!formData[key]) {
      alert(`Please fill in the "${key}" field.`);
      return;
    }
  }

  // Check for HTML/script tags in any input
  const invalidField = hasInvalidInput(formData);
  if (invalidField) {
    alert(`Invalid input in "${invalidField}". HTML or script tags are not allowed.`);
    return;
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Basic phone number check (10-15 digits)
  if (!/^\d{10,15}$/.test(formData.pnumber)) {
    alert('Please enter a valid phone number (10-15 digits).');
    return;
  }

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
    alert('Connection failed');
    console.log('Signup error:', error);
  }
});

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    email: document.getElementById('login_mail').value,
    password: document.getElementById('login_password').value
  };

  trimFields(formData);

  // Check for empty fields
  for (const key in formData) {
    if (!formData[key]) {
      alert(`Please fill in the "${key}" field.`);
      return;
    }
  }

  // Check for HTML/script tags in any input
  const invalidField = hasInvalidInput(formData);
  if (invalidField) {
    alert(`Invalid input in "${invalidField}". HTML or script tags are not allowed.`);
    return;
  }

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

// Contact form handler
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    cname: document.getElementById('cname').value,
    cemail: document.getElementById('cemail').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  trimFields(formData);

  // Check for empty fields
  for (const key in formData) {
    if (!formData[key]) {
      alert('Please fill in all fields!');
      return;
    }
  }

  // Check for HTML/script tags in any input
  const invalidField = hasInvalidInput(formData);
  if (invalidField) {
    alert(`Invalid input in "${invalidField}". HTML or script tags are not allowed.`);
    return;
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.cemail)) {
    alert('Please enter a valid email address.');
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