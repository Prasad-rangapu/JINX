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
  window.location.href=`../login.html`;}


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
          <span>By <strong style="color:black">${post.username || 'Anonymous'}</strong></span>
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
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <small style="float:right; color:black;">Likes ${post.likes}</small>
    <small style="float:left; color:black;">On ${new Date(post.created_at).toLocaleDateString()}</small>
  </div>
`).join('');
}

function showForm() {
  const form = document.querySelector('.post-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function submitPost(event) {
  event.preventDefault();
  const title = document.getElementById('post-title').value;
  const description = document.getElementById('post-desc').value;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Please login to publish a post');
    window.location.href = '../login.html';
    return;
  }
  const id = currentUser.id;

  const res = await fetch('https://jinx-backend.onrender.com/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title, description }),
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


