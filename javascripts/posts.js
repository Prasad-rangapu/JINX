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
    <button class="edit-btn" onclick='showEditForm(${JSON.stringify({ id: post.id, title: post.title, content: post.content })})' style="float:right; color:blue;">Edit</button>
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <small style="float:right; color:black;">Likes ${post.likes}</small>
    <small style="float:left; color:black;">On ${new Date(post.created_at).toLocaleDateString()}</small>
  </div>
`).join('');
}

function showForm() {
  const form = document.querySelector('.post-form');
  if (form.style.display === 'block') {
    form.style.display = 'none';
  } else {
    form.style.display = 'block';
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

// Helper to escape HTML (for safe rendering)
function escapeHTML(str) {
  return String(str).replace(/[&<>"'`=\/]/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
    "'": '&#39;', '`': '&#96;', '=': '&#61;', '/': '&#47;'
  })[s]);
}

// Show the edit form with post data and action buttons
function showEditForm(post) {
  // Remove any existing modal
  let modal = document.getElementById('edit-form-modal');
  if (modal) modal.remove();

  // Create modal overlay
  modal = document.createElement('div');
  modal.id = 'edit-form-modal';
  modal.innerHTML = `
    <div id="edit-form-container">
      <form id="edit-post-form" class="post-form" autocomplete="off">
        <label for="edit-post-title"><b>Title</b></label>
        <input type="text" id="edit-post-title" value="${escapeHTML(post.title)}" required>
        <label for="edit-post-desc"><b>Description</b></label>
        <textarea id="edit-post-desc" rows="5" required>${escapeHTML(post.content)}</textarea>
        <div class="edit-actions">
          <button type="submit">Save</button>
          <button type="button" id="delete-post-btn">Delete</button>
          <button type="button" id="cancel-edit-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // Save (update) post
  document.getElementById('edit-post-form').onsubmit = async function(e) {
    e.preventDefault();
    const title = document.getElementById('edit-post-title').value.trim();
    const content = document.getElementById('edit-post-desc').value.trim();
    const saveBtn = this.querySelector('button[type="submit"]');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    // Validate for HTML/script tags
    const invalidField = hasInvalidInput({ title, content });
    if (invalidField) {
      alert(`Invalid input in "${invalidField}". HTML or script tags are not allowed.`);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
      return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`https://jinx-backend.onrender.com/api/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description: content })
    });

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';

    if (res.ok) {
      alert('Post updated!');
      modal.remove();
      loadUserPosts();
    } else {
      const error = await res.json();
      alert(`Error: ${error.message}`);
    }
  };

  // Delete post
  document.getElementById('delete-post-btn').onclick = async function() {
    if (!confirm('Are you sure you want to delete this post?')) return;
    this.disabled = true;
    this.textContent = 'Deleting...';
    const token = localStorage.getItem('token');
    const res = await fetch(`https://jinx-backend.onrender.com/api/posts/${post.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    this.disabled = false;
    this.textContent = 'Delete';
    if (res.ok) {
      alert('Post deleted!');
      modal.remove();
      loadUserPosts();
    } else {
      const error = await res.json();
      alert(`Error: ${error.message}`);
    }
  };

  // Cancel editing (close modal)
  document.getElementById('cancel-edit-btn').onclick = function() {
    modal.remove();
  };

  // Close modal on overlay click (optional)
  modal.onclick = function(e) {
    if (e.target === modal) modal.remove();
  };
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


