import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  loginUser,
  clearAuthError,
  selectAuthError,
  selectAuthLoading
} from '../../redux-store/auth.slice'

const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const loading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setErrorMsg('Email and password are required.')
      return
    }

    setErrorMsg('')
    const result = await dispatch(
      loginUser({
        email: email.trim(),
        password
      })
    )

    if (loginUser.fulfilled.match(result)) {
      history.push('/tasks')
    }
  }

  return (
    <div>
      <h2>Sign In</h2>
      <p>Enter your details to access your account.</p>

      {(authError || errorMsg) && (
        <div>
          <p>{authError || errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email Address: </label>
          <input
            type='email'
            placeholder='Enter your email...'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              dispatch(clearAuthError())
            }}
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type='password'
            placeholder='Enter your password...'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              dispatch(clearAuthError())
            }}
          />
        </div>

        <button type='submit' disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p>
        Don't have an account? <Link to='/signup'>Sign up</Link>
      </p>
    </div>
  )
}

export default Login
