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
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) window.location.href = `home.html`;
    else alert('Signup failed: ' + (data.error || 'Unknown error'));

  } catch (error) {
    console.error('Signup error:', error);
    alert('Connection failed');
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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) window.location.href = `home.html`;
    else alert('Login failed: ' + (data.error || 'Invalid credentials'));

  } catch (error) {
    console.error('Login error:', error);
    alert('Connection failed');
  }
});

async function checklogin(){
  try{
  var email=document.getElementById('checkmail').value;
  const response =await fetch('/emailcheck',{
    method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(email)
  });
  
  const data = await response.json();
    if (data.success) window.location.href = `login.html`;
    else window.location.href=`sign_up.html`;
}
  catch(error){
    console.log(error);
  }
}
