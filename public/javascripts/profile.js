function loadUserDetails(){
    try{
          const currentUser=JSON.parse(localStorage.getItem('currentUser'));
document.getElementById('user-details').innerHTML=`<p>${currentUser.username}</p> <br/> <p>${currentUser.fname} ${currentUser.lname}</p> <br/> 
Email:<br/>${currentUser.email} <br/> Phone Number : ${currentUser.pnumber} `;


    }
catch(error)
{
    document.getElementById('user-details').innerHTML=`<p>unable to load the profile please load </p>`;
    alert('unable to load profile \n please re-login' )
    window.location.href='../login.html';
    console.error('unable to load profile:',error)
}
}