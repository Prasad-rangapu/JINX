document.addEventListener('DOMContentLoaded', () => {
  const typingText = document.querySelector('.typing-text');
  const cursor = document.querySelector('.cursor');
  const text = "Getting Started with Blogging....";
  const words = text.split(' ');
  let index = 0;

  function typeWord() {
    if (index < words.length) {
      typingText.textContent += `${index ? ' ' : ''}${words[index]}`;
      index++;
      setTimeout(typeWord, 300);
    } else {
      cursor.style.animation = 'none';
      cursor.style.opacity = '0';
    }
  }
  
  typeWord();
});

async function checklogin() {
  const emailInput = document.getElementById("checkmail");
  const email = emailInput.value.trim(); 

  if (!email) {
    alert('Please enter your email address.'); 
    emailInput.focus(); 
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address format (e.g., example@domain.com).'); 
    emailInput.focus();
    return;
  }

  try {
    const response = await fetch('https://jinx-backend.onrender.com/api/auth/checklogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.isUserFound) { 
        window.location.href = 'login.html';
      
        document.getElementById("login_mail").value=email;
      
    } else {
        window.location.href = 'sign_up.html';
    }

  } catch (error) {
      
      console.error('Login check failed:', error);
      
      alert('An error occurred while checking your login. Please try again later.'); 
  }
}


