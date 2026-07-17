import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute() {
  const session = useSelector((state) => state.auth)
  const location = useLocation()
  return session?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate replace state={{ from: location.pathname + location.search }} to="/dang-nhap" />
  )
}
export default ProtectedRoute
