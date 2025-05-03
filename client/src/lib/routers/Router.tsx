import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginForm } from 'src/pages/login'
import { protectedRoutes } from 'src/routes'
import { AppRoutes } from '../routes'
import RequireAuth from './PrivateRoute'

export function AppRouter() {
  return (
    <Routes>
      {/* Public route for login */}
      <Route path="/login" element={<LoginForm />} />
      // Default route: redirects to orders/production
      <Route path="/" element={<Navigate to={AppRoutes.help} />} />
      {/* Protected routes requiring authentication */}
      {protectedRoutes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={<RequireAuth>{route.element}</RequireAuth>}
        />
      ))}
    </Routes>
  )
}
