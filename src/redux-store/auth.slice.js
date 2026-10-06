import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSession, saveSession, clearSession } from '../utils/authStorage'
import { loginUserService, registerUserService } from '../services/auth.service'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUserService({ email, password })
      const { user, token } = response.data
      saveSession(user, token)
      return user
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to login.')
    }
  }
)

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserService(userData)
      const { user, token } = response.data
      saveSession(user, token)
      return user
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to create account.')
    }
    
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getSession(),
    isAuthenticated: Boolean(getSession()),
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      clearSession()
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout, clearAuthError } = authSlice.actions

export const selectAuthUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
