import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './views/home'


const router = createBrowserRouter([
  {
    path: '/',
    children: [{ path: '', element: <Home /> }],
  },
])

export default function Routes() {
  return <RouterProvider router={router} />
}
