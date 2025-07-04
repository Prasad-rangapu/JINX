async function addLike(postId)
{
  const currentUser=JSON.parse(localStorage.getItem('currentUser'));
  if(!currentUser)
  {
    alert("Please login to like post");
    window.location.href=`login.html`;
    return;
  }
 try{

userId=currentUser.id;
const token = localStorage.getItem('token');

 const response = await fetch(`https://jinx-backend.onrender.com/api/posts/${postId}/like`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // <-- Send JWT
    },
    body: JSON.stringify({ postId, userId })
    
  });

if(response.ok)
{
  const post = await response.json();
  const likesCountElement = document.querySelector(`#likes-count-${postId}`);
  const likeBtnElement = document.querySelector(`#like-btn-${postId}`);
  // if(likeBtnElement)
  // {
  //   likeBtnElement.style.display="none";
  // }
  if(likesCountElement)
  {
    likesCountElement.innerText=post.likes;
    
  } 
}
else if(response.status===401)
{
  alert("Please login to like post");
  window.location.href=`login.html`;}


 }catch(error)
 {
  console.log("Error liking post",error);
  alert("Error liking post");
 }


}




function renderPosts(posts, containerId) {
  const container = document.getElementById(containerId);
  if (!posts.length) {
    container.innerHTML = `<div style="text-align:center;color:#888;">No posts found.</div>`;
    return;
  }
  container.innerHTML = posts.map(post => `
    <div class="post">
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <div class="post-footer">
        <div>
          <button id="like-btn-${post.id}" class="like-btn" onclick="addLike(${post.id})" title="Like this post">&#x2665;</button>
          <span id="likes-count-${post.id}" class="likes-count">${post.likes}</span>
        </div>
        <div>
          <span  style="color:black;">By <strong>${post.username || 'Anonymous'}</strong></span>
          <span style="margin-left:8px;color:#64748b;">${new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  `).join('');
}

  const currentUser=JSON.parse(localStorage.getItem('currentUser'));

document.getElementById('welcome-user').innerText=`Welcome ${currentUser.username}`;


async function loadRecentPosts() {
  const res = await fetch('https://jinx-backend.onrender.com/api/posts/recent');
  const posts = await res.json();
  renderPosts(posts, 'recent-posts');
}

async function loadRandomPosts() {
  const res = await fetch('https://jinx-backend.onrender.com/api/posts/random');
  const posts = await res.json();
  renderPosts(posts, 'blog-results');
}

async function searchPosts() {
  const query = document.getElementById('blog-search').value.trim();
  if (!query) return;
  const res = await fetch(`https://jinx-backend.onrender.com/api/posts/search?q=${encodeURIComponent(query)}`);
  const posts = await res.json();
  renderPosts(posts, 'blog-results');
}

async function loadUserPosts() {
  const currentUser=JSON.parse(localStorage.getItem('currentUser'));
const id=currentUser.id;

  const res = await fetch(`https://jinx-backend.onrender.com/api/posts/${id}`);
  const posts = await res.json();
  const container = document.getElementById('user-posts');
  container.innerHTML = posts.map(post => `
  <div class="post">
    <button class="edit-btn" onclick='showForm(${JSON.stringify({ id: post.id, title: post.title, content: post.content })})' style="float:right; color:blue;">Edit</button>
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <small style="float:right; color:black;">Likes ${post.likes}</small>
    <small style="float:left; color:black;">On ${new Date(post.created_at).toLocaleDateString()}</small>
  </div>
`).join('');
}

function showForm(post = null) {
  const form = document.querySelector('.post-form');
  form.style.display = 'block';

  const titleInput = document.getElementById('post-title');
  const descInput = document.getElementById('post-desc');

  if (post) {
    // Editing: fill inputs with post values
    titleInput.value = post.title || '';
    descInput.value = post.content || '';
    form.setAttribute('data-edit-id', post.id); // Optionally track which post is being edited
  } else {
    // Creating new: clear inputs
    titleInput.value = '';
    descInput.value = '';
    form.removeAttribute('data-edit-id');
  }
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

async function submitPost(event) {
  event.preventDefault();
  const title = document.getElementById('post-title').value;
  const description = document.getElementById('post-desc').value;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Please login to publish a post');
    window.location.href = 'login.html';
    return;
  }

  // Validate for HTML/script tags
  const invalidField = hasInvalidInput({ title, description });
  if (invalidField) {
    alert(`Invalid input in "${invalidField}". HTML or script tags are not allowed.`);
    return;
  }

  const token = localStorage.getItem('token'); // <-- Add this line

  const res = await fetch('https://jinx-backend.onrender.com/api/posts', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, description }),
  });

  if (res.ok) {
    alert('Post published!');
    document.querySelector('.post-form').reset();
    loadUserPosts();
  } else {
    const error = await res.json();
    alert(`Error: ${error.message}`);
  }
}


