const searchBtn = document.getElementById('search-button');

const usernameInput = document.getElementById('usernameInput');

const profileDiv = document.getElementById('profile');

function showMessage(message, isError = false) {
  profileDiv.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = message;
  if (isError) p.classList.add('error');
  profileDiv.appendChild(p);
}

function renderProfile(data) {
  profileDiv.innerHTML = '';

  const card = document.createElement('div');

  card.className = 'profile-card';

  const img = document.createElement('img');
  img.src = data.avatar_url;
  img.alt = `${data.login}'s avataar`;

  const details = document.createElement('div');
  details.className = 'profile-details';

  const name = document.createElement('h2');
  name.textContent = data.name || data.login;

  const stats = document.createElement('p');
  stats.innerHTML = `<strong>Followers:</strong> ${data.followers} | <strong>Following:</strong> ${data.following}`;

  const repos = document.createElement('p');
  repos.innerHTML = `<strong>Public Repos:</strong> ${data.public_repos}`;

  const link = document.createElement('a');
  link.href = data.html_url;

  link.target = '_blank';

  link.rel = 'noopener noreferrer';

  link.textContent = 'View GitHub Profile';

  details.appendChild(name);
  details.appendChild(stats);
  details.appendChild(repos);
  details.appendChild(link);

  card.appendChild(img);
  card.appendChild(details);

  profileDiv.appendChild(card);
}

async function fetchProfile() {
  const username = usernameInput.value.trim();

  if (!username) {
    showMessage('Please enter a GitHub username.', true);
    return;
  }

  showMessage('Loading...');

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      if (response.status === 404) {
        showMessage('User not found. Please try another username.', true);
      } else {
        showMessage('Error fetching data. Please try again later.', true);
      }
      return;
    }

    const data = await response.json();
    renderProfile(data);

  } catch (error) {
    showMessage('Network error. Please check your connection and try again.', true);
  }
}

searchBtn.addEventListener('click', fetchProfile);

usernameInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    fetchProfile();
  }
});
