// app/RouteGuards.jsx
// Two small wrapper components that gate access based on auth state
// (see redux/slices/authSlice.js). Used directly in app/router.jsx's
// route tree.
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

/** Wrap any route tree that requires a logged-in user. */
export function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

/** Wrap /login and /register — bounce an already-logged-in user straight to the dashboard. */
export function GuestOnlyRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
