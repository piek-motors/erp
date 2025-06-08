import { routeMap } from 'lib/routes'
import { LoginForm } from 'pages/login'
import { Navigate, Route, Routes } from 'react-router-dom'
import { protectedRoutes } from 'routes'
import RequireAuth from './PrivateRoute'

export function AppRouter() {
  return (
    <Routes>
      {/* Public route for login */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/help" element={<Navigate to={routeMap.index} />} />
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
