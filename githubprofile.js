const searchBtn = document.getElementById('search-button')
const usernameInput = document.getElementById('usernameInput')
const profileDiv = document.getElementById('profile')

async function fetchProfile() {
  const username = usernameInput.value.trim()
  if (!username) {
    profileDiv.innerHTML =
      '<p class="error">Please enter a GitHub username.</p>'
    return
  }

  profileDiv.innerHTML = '<p>Loading...</p>'

  try {
    const response = await fetch(`https://api.github.com/users/${username}`)

    if (!response.ok) {
      if (response.status === 404) {
        profileDiv.innerHTML =
          '<p class="error">User not found. Please try another username.</p>'
      } else {
        profileDiv.innerHTML =
          '<p class="error">Error fetching data. Please try again later.</p>'
      }
      return
    }

    const data = await response.json()

    profileDiv.innerHTML = `
      <div class="profile-card">
        <img src="${data.avatar_url}" alt="${data.login}'s avatar" />
        <div class="profile-details">
          <h2>${data.name ? data.name : data.login}</h2>
          <p><strong>Followers:</strong> ${
            data.followers
          } | <strong>Following:</strong> ${data.following}</p>
          <p><strong>Public Repos:</strong> ${data.public_repos}</p>
          <a href="${
            data.html_url
          }" target="_blank" rel="noopener noreferrer">View GitHub Profile</a>
        </div>
      </div>
    `
  } catch (error) {
    profileDiv.innerHTML =
      '<p class="error">Network error. Please check your connection and try again.</p>';
  }
}

searchBtn.addEventListener('click', fetchProfile)

usernameInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    fetchProfile()
  }
})
