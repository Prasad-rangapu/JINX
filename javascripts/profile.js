function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#96;',
      '=': '&#61;',
      '/': '&#47;'
    })[s];
  });
}

// Helper to check for HTML/script tags
function checkInput(input) {
  const tagPattern = /<[^>]*>/g;
  return tagPattern.test(input);
}
function hasInvalidInput(obj) {
  for (const key in obj) {
    if (checkInput(obj[key])) {
      return key;
    }
  }
  return null;
}

function loadUserDetails() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) throw new Error('No user found');
    // Escape all user data before inserting into HTML
    document.getElementById('user-details').innerHTML = `
      <p>${escapeHTML(currentUser.username)}</p> <br/>
      <p>${escapeHTML(currentUser.firstname)} ${escapeHTML(currentUser.lastname)}</p> <br/>
      Email:<br/>${escapeHTML(currentUser.email)} <br/>
      Phone Number : ${escapeHTML(currentUser.phone)}
    `;
  } catch (error) {
    document.getElementById('user-details').innerHTML = `<p>Unable to load the profile. Please reload.</p>`;
    alert('Unable to load profile.\nPlease re-login.');
    window.location.href = 'login.html';
    console.error('Unable to load profile:', error);
  }
}

// Profile picture change logic
document.getElementById('profile-pic').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Only allow jpg, jpeg, png and max 2MB size
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (!allowedTypes.includes(file.type)) {
    alert('Only JPG, JPEG, or PNG images are allowed.');
    event.target.value = '';
    return;
  }
  if (file.size > maxSize) {
    alert('Image size should be less than 2MB.');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('profile-img').src = e.target.result;
    localStorage.setItem('profilePic', e.target.result);
  };
  reader.readAsDataURL(file);
});

// On page load, restore profile pic if saved
window.addEventListener('DOMContentLoaded', () => {
  const savedPic = localStorage.getItem('profilePic');
  if (savedPic) {
    document.getElementById('profile-img').src = savedPic;
  }
  loadUserDetails();
});
