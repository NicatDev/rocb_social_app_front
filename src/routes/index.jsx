import { lazy } from 'react'

// Lazy load page-lar
const Home = lazy(() => import('../pages/Home'))
const Login = lazy(() => import('../pages/Login'))

const routes = [
  {
    path: '/',
    element: <Home />,
    index: true
  },
  {
    path: '/login',
    element: <Login />,
    index: true
  }
]

export default routes