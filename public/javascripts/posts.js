
function renderPosts(posts, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = posts.map(post => `
    <div class="post">
      <h3>${post.title}</h3>
      <p>${post.content}</p>
            <small style="float:right;"><button id="like-btn" onclick="addLike()">&#x2665;</button>${post.likes}</small>

      <small>By ${post.username || 'Anonymous'} on ${new Date(post.created_at).toLocaleDateString()}</small>
    </div>
  `).join('');
}

function addLike()
{
 
}



async function loadRecentPosts() {
  const res = await fetch('http://localhost:3000/api/posts/recent');
  const posts = await res.json();
  renderPosts(posts, 'recent-posts');
}

async function loadRandomPosts() {
  const res = await fetch('http://localhost:3000/api/posts/random');
  const posts = await res.json();
  renderPosts(posts, 'blog-results');
}

async function searchPosts() {
  const query = document.getElementById('blog-search').value.trim();
  if (!query) return;
  const res = await fetch(`http://localhost:3000/api/posts/search?q=${encodeURIComponent(query)}`);
  const posts = await res.json();
  renderPosts(posts, 'blog-results');
}

async function loadUserPosts() {
  const currentUser=JSON.parse(localStorage.getItem('currentUser'));
const id=currentUser.id;

  const res = await fetch(`http://localhost:3000/api/posts/${id}`);
  const posts = await res.json();
  const container = document.getElementById('user-posts');
  container.innerHTML = posts.map(post => `
    <div class="post">
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small style="float:right;">Likes ${post.likes}</small>
      <small style="float:left;">On ${new Date(post.created_at).toLocaleDateString()}</small>
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
const currentUser=JSON.parse(localStorage.getItem('currentUser'));
const id=currentUser.id;

  const res = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id,title, description }),
  });

  if (res.ok) {
    alert('Post published!');
    document.querySelector('.post-form').reset();
    loadUserPosts();
  }
}


