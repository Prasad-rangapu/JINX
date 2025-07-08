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
        window.location.href = '../login.html';
        document.getElementById("checkmail").value = ''; // Clear the input field after redirection
        document.getElementById("login_mail").value=email;
    } else {
        window.location.href = '../sign_up.html';
    }

  } catch (error) {
      
      console.error('Login check failed:', error);
      
      alert('An error occurred while checking your login. Please try again later.'); // {Link: web.dev advises to provide helpful messaging within a catch block https://web.dev/articles/fetch-api-error-handling}.
  }
}

/**
 * Validate e‑mail, call the backend, and redirect.
 * Runs on the “continue” button of the pre‑login page.
 */
// export async function checklogin () {
//   const input = /** @type {HTMLInputElement} */ (
//     document.getElementById('checkmail')
//   );
//   const email = input.value.trim();

//   if (!email) {
//     alert('Please enter your e‑mail address.');
//     input.focus();
//     return;
//   }

//   const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRx.test(email)) {
//     alert('Please enter a valid e‑mail (e.g. user@domain.com).');
//     input.focus();
//     return;
//   }

  
//   showLoader('Waking server…');

//   try {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 25_000); 

//     const res = await fetch(
//       'https://jinx-backend.onrender.com/api/auth/checklogin',
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//         signal: controller.signal
//       }
//     );
//     clearTimeout(timeout);

//     let body;
//     const ct = res.headers.get('content-type') ?? '';
//     if (ct.startsWith('application/json')) {
//       body = await res.json();
//     } else {
//       const text = await res.text();
//       throw new Error(`Unexpected body: ${text.slice(0, 100)}`);
//     }

//     if (!res.ok || body?.ok === false) {
//       throw new Error(
//         body?.message || `HTTP ${res.status} ${res.statusText}`
//       );
//     }

    
//     if (body.isUserFound) {
//       window.location.href = '../login.html';
//       document.getElementById('login_mail').value = email;
//     } else {
//       window.location.href = '../sign_up.html';
//     }
//   } catch (err) {
//     console.error('Login check failed:', err);
//     alert(
//       'Sorry, we could not verify your account right now. ' +
//       'Please try again in a minute.'
//     );
//   } finally {
//     hideLoader();
//     input.value = '';        
//   }
// }



// function showLoader(msg) {
//   let el = document.getElementById('global-loader');
//   if (!el) {
//     el = document.createElement('div');
//     el.id = 'global-loader';
//     Object.assign(el.style, {
//       position: 'fixed',
//       inset: 0,
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: 'rgba(255,255,255,0.8)',
//       fontFamily: 'sans-serif',
//       fontSize: '1.1rem',
//       zIndex: 9999
//     });
//     document.body.append(el);
//   }
//   el.textContent = msg;
// }

// function hideLoader() {
//   document.getElementById('global-loader')?.remove();
// }

