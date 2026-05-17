import { Navigate, Route, Routes } from 'react-router'
import { routeMap } from '@/lib/routes'
import { protectedRoutes } from '@/routes'
import { LoginForm } from '../../login'
import type { RouteConfig } from '../types/global'
import RequireAuth from './PrivateRoute'

const renderRoutes = (routes: RouteConfig[]) =>
  routes.map((route, i) => (
    <Route
      key={route.path ?? i}
      path={route.path}
      element={<RequireAuth>{route.element}</RequireAuth>}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ))

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/help" element={<Navigate to={routeMap.index} />} />

      {renderRoutes(protectedRoutes)}

      <Route path="*" element={<Navigate to={routeMap.index} replace />} />
    </Routes>
  )
}
