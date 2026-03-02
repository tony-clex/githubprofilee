document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-button')
  const usernameInput = document.getElementById('username-input')
  const profileDiv = document.getElementById('profile')

  const clearProfile = () => profileDiv.replaceChildren()

  const fetchProfile = async () => {
    const username = usernameInput.value.trim()
    if (!username) return showMessage('Please enter a GitHub username.', true)

    showMessage('Loading...')
    try {
      const res = await fetch(`https://api.github.com/users/${username}`)
      if (!res.ok) {
        if (res.status === 404) showMessage('User not found. Please try another username.', true)
        else if (res.status === 403) showMessage('Rate limit exceeded. Please try again later.', true)
        else showMessage('Error fetching data. Please try again later.', true)
        return
      }
      renderProfile(await res.json())
    } catch (err) {
      console.error(err)
      showMessage('Network error. Please check your connection.', true)
    }
  }

  searchBtn.addEventListener('click', fetchProfile)
  usernameInput.addEventListener('keydown', e => e.key === 'Enter' && fetchProfile())

  const showMessage = (message, isError = false) => {
    clearProfile()
    const p = document.createElement('p')
    p.textContent = message
    if (isError) p.classList.add('error')
    profileDiv.appendChild(p)
  }

  const renderProfile = data => {
    clearProfile()
    const card = document.createElement('div')
    card.className = 'profile-card'

    const img = document.createElement('img')
    img.src = data.avatar_url || ''
    img.alt = data.login ? `${data.login}'s avatar` : 'GitHub avatar'

    const details = document.createElement('div')
    details.className = 'profile-details'

    const name = document.createElement('h2')
    name.textContent = data.name || data.login || 'Unknown User'

    const stats = document.createElement('p')
    stats.textContent = `Followers: ${data.followers} | Following: ${data.following}`

    const repos = document.createElement('p')
    repos.textContent = `Public Repos: ${data.public_repos}`

    const link = document.createElement('a')
    link.href = data.html_url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = 'View GitHub Profile'

    details.append(name, stats, repos, link)
    card.append(img, details)
    profileDiv.appendChild(card)
  }
})