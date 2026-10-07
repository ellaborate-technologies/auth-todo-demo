const SESSION_KEY = 'auth-todo-session'

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || localStorage.getItem('gaming-demo-session'))
  } catch {
    return null
  }
}

export const saveSession = (user, token) => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      token: token || user.token
    })
  )
}

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
}
