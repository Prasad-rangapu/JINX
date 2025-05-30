function loadUserDetails(){
    try{
          const currentUser=JSON.parse(localStorage.getItem('currentUser'));
document.getElementById('user-details').innerHTML=`<p>${currentUser.username}</p> <br/> <p>${currentUser.firstname} ${currentUser.lastname}</p> <br/> 
Email:<br/>${currentUser.email} <br/> Phone Number : ${currentUser.phone} `;


    }
catch(error)
{
    document.getElementById('user-details').innerHTML=`<p>unable to load the profile please load </p>`;
    alert('unable to load profile \n please re-login' )
    window.location.href='/Blog/public/login.html';
    console.error('unable to load profile:',error)
}
}

// Profile picture change logic
document.getElementById('profile-pic').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profile-img').src = e.target.result;
      localStorage.setItem('profilePic', e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// On page load, restore profile pic if saved
window.addEventListener('DOMContentLoaded', () => {
  const savedPic = localStorage.getItem('profilePic');
  if (savedPic) {
    document.getElementById('profile-img').src = savedPic;
  }
});