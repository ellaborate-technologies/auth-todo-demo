import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  signupUser,
  clearAuthError,
  selectAuthError,
  selectAuthLoading
} from '../../redux-store/auth.slice'

const Signup = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const loading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('All fields are required.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setErrorMsg('')
    const result = await dispatch(
      signupUser({
        username: username.trim(),
        email: email.trim(),
        password
      })
    )

    if (signupUser.fulfilled.match(result)) {
      history.push('/tasks')
    }
  }

  return (
    <div>
      <h2>Create Account</h2>
      <p>Sign up to get started.</p>

      {(authError || errorMsg) && (
        <div>
          <p>{authError || errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type='text'
            placeholder='Enter your username...'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              dispatch(clearAuthError())
            }}
          />
        </div>

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

        <div>
          <label>Confirm Password: </label>
          <input
            type='password'
            placeholder='Confirm your password...'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              dispatch(clearAuthError())
            }}
          />
        </div>

        <button type='submit' disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p>
        Already have an account? <Link to='/login'>Log in here</Link>
      </p>
    </div>
  )
}

export default Signup
