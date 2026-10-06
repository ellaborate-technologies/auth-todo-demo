import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../redux-store/auth.slice'

const PublicRoutes = ({ component: Component, restricted = false, ...rest }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && restricted ? (
          <Redirect to='/tasks' />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

export default PublicRoutes
