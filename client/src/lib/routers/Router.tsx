import { routeMap } from '@/lib/routes'
import { protectedRoutes } from '@/routes'
import { Navigate, Route, Routes } from 'react-router'
import { LoginForm } from '../../login'
import RequireAuth from './PrivateRoute'

export function AppRouter() {
  console.log('router exec')
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

      <Route path="*" element={<Navigate to={routeMap.index} replace />} />
    </Routes>
  )
}
