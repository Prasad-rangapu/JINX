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
  const res = await fetch('http://localhost:3000/api/posts/user');
  const posts = await res.json();
  renderPosts(posts, 'user-posts');
}

function showForm() {
  const form = document.querySelector('.post-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function submitPost(event) {
  event.preventDefault();
  const title = document.getElementById('post-title').value;
  const description = document.getElementById('post-desc').value;

  const res = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });

  if (res.ok) {
    alert('Post published!');
    document.querySelector('.post-form').reset();
    loadUserPosts();
  }
}

function renderPosts(posts, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = posts.map(post => `
    <div class="post">
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      <small>By ${post.author || 'Anonymous'} on ${new Date(post.created_at).toLocaleDateString()}</small>
    </div>
  `).join('');
}

async function loadUserDetails() {
  const res = await fetch('http://localhost:3000/api/users/profile');
  const user = await res.json();
  const container = document.getElementById('user-details');
  container.innerHTML = `
    <h2>${user.name}</h2>
    <p>Email: ${user.email}</p>
    <p>Joined: ${new Date(user.created_at).toLocaleDateString()}</p>
  `;
}
