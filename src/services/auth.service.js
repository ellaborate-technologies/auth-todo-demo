import axios from 'axios'
import { AUTH_API } from '../network/apis/auth.api'
import { getSession } from '../utils/authStorage'

const handleAxiosError = (error) => {
  const message = error.response?.data?.message || error.message || 'Network error occurred'
  throw new Error(message)
}

export const registerUserService = async ({ username, email, password }) => {
  try {
    const response = await axios.post(AUTH_API.REGISTER, {
      username,
      email,
      password
    })
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export const loginUserService = async ({ email, password }) => {
  try {
    const response = await axios.post(AUTH_API.LOGIN, {
      email,
      password
    })
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export const fetchAuthUserService = async () => {
  try {
    const session = getSession()
    const response = await axios.get(AUTH_API.ME, {
      headers: {
        Authorization: session?.token ? `Bearer ${session.token}` : ''
      }
    })
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export const logoutUserService = async () => {
  try {
    const session = getSession()
    const response = await axios.post(
      AUTH_API.LOGOUT,
      {},
      {
        headers: {
          Authorization: session?.token ? `Bearer ${session.token}` : ''
        }
      }
    )
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}
