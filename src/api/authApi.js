import api from './config'

export const register = (email, password) => {
  return api.post('/api/users/register', {
    email,
    password
  })
}

export const login = (email, password) => {
  return api.post('/api/token', {
    email,
    password
  })
}
