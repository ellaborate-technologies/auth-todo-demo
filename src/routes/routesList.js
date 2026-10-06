import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Tasks from '../pages/Tasks'

export const routesList = [
  {
    path: '/login',
    exact: true,
    component: Login,
    isPrivate: false,
    restricted: true
  },
  {
    path: '/signup',
    exact: true,
    component: Signup,
    isPrivate: false,
    restricted: true
  },
  {
    path: '/tasks',
    exact: true,
    component: Tasks,
    isPrivate: true
  }
]
