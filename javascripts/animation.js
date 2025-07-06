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

// Function to check login status and redirect accordingly
async function checklogin() {
  const emailInput = document.getElementById("checkmail");
  const email = emailInput.value.trim(); // Trim whitespace from email

  // More specific and user-friendly validation messages
  if (!email) {
    alert('Please enter your email address.'); // Or display in a dedicated error message area
    emailInput.focus(); // Set focus to the input field
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
        document.getElementById("checkmail").value = ''; // Clear the input field after redirection
        document.getElementById("login_mail").value=email;
    } else {
        window.location.href = 'sign_up.html';
    }

  } catch (error) {
      
      console.error('Login check failed:', error);
      
      alert('An error occurred while checking your login. Please try again later.'); // {Link: web.dev advises to provide helpful messaging within a catch block https://web.dev/articles/fetch-api-error-handling}.
  }
}
