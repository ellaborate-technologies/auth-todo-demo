import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectAuthUser } from '../redux-store/auth.slice'

const MainLayout = ({ children }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(selectAuthUser)

  const handleLogout = () => {
    dispatch(logout())
    history.push('/login')
  }

  return (
    <div>
      <header>
        <nav>
          <Link to='/tasks'>Tasks</Link>
          {' | '}
          <span>User: {user?.username || 'User'}</span>
          {' | '}
          <button type='button' onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <hr />
      <main>
        {children}
      </main>
    </div>
  )
}

export default MainLayout
