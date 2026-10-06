import React from 'react'
import { Switch, Redirect, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PublicRoutes from './PublicRoutes'
import PrivateRoutes from './PrivateRoutes'
import { routesList } from './routesList'
import { selectIsAuthenticated } from '../redux-store/auth.slice'

const AppRoutes = () => {
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <Switch location={location}>
      {routesList.map((route) => {
        if (route.isPrivate) {
          return (
            <PrivateRoutes
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          )
        }
        return (
          <PublicRoutes
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
            restricted={route.restricted}
          />
        )
      })}
      <Redirect to={isAuthenticated ? '/tasks' : '/login'} />
    </Switch>
  )
}

export default AppRoutes
