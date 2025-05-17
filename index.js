const searchInput = document.getElementById('search');
const userInfo = document.getElementById('user-info');
const loader = document.getElementById('loader');

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

async function fetchGitHubUser(username) {
  if (!username) {
    userInfo.innerHTML = '';
    return;
  }

  loader.style.display = 'block';
  userInfo.innerHTML = '';

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    loader.style.display = 'none';

    if (!response.ok) throw new Error('User not found');

    const data = await response.json();
    userInfo.innerHTML = `
      <img src="${data.avatar_url}" width="100" />
      <h2>${data.name || data.login}</h2>
      <p>Followers: ${data.followers}</p>
      <p>Public Repos: ${data.public_repos}</p>
      <a href="${data.html_url}" target="_blank">View Profile</a>
    `;
  } catch (err) {
    loader.style.display = 'none';
    userInfo.innerHTML = `<p style="color: red;">${err.message}</p>`;
  }
}

searchInput.addEventListener('input', debounce(e => {
  fetchGitHubUser(e.target.value.trim());
}, 500));
