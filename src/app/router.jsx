// src/app/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from '../layout/AppShell';
import { ProtectedRoute, GuestOnlyRoute } from './RouteGuards';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyOtp from '../pages/auth/VerifyOtp';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import DashboardPage from '../features/dashboard/DashboardPage';
import EmailInboxPage from '../features/email-inbox/EmailInboxPage';
import QuotesPage from '../features/quotes/QuotesPage';
import HouseJobsPage from '../features/house-jobs/HouseJobsPage';
import ComingSoon from '../components/patterns/ComingSoon';
import RolesPage from '../features/roles/RolesPage';
import RoleFormPage from '../features/roles/RoleFormPage';
import PermissionsPage from '../features/permissions/PermissionsPage';
import PermissionFormPage from '../features/permissions/PermissionFormPage';
import UsersPage from '../features/users/UsersPage';
import UserFormPage from '../features/users/UserFormPage';

const PLACEHOLDER_ROUTES = [
  ['customers', 'Customers'],
  ['master-jobs', 'Master Jobs'],
  ['task-engine', 'Task Engine'],
  ['transport', 'Transport'],
  ['warehouse', 'Warehouse'],
  ['customs', 'Customs'],
  ['cost-revenue', 'Cost & Revenue'],
  ['invoices', 'Invoices'],
  ['documents', 'Documents'],
  ['reports/sales', 'Sales Report'],
  ['reports/operations', 'Operations Report'],
  ['reports/financial', 'Financial Report'],
  ['settings/configurations', 'Configurations'],
];

export const router = createBrowserRouter([
  // ── Public Guest Routes ──
  {
    element: <GuestOnlyRoute />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },

  { path: 'verify-otp', element: <VerifyOtp /> },

  // ── Protected Routes ──
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'inbox', element: <EmailInboxPage /> },
          { path: 'quotes', element: <QuotesPage /> },
          { path: 'house-jobs', element: <HouseJobsPage /> },
          { path: 'settings/roles', element: <RolesPage /> },
          { path: 'settings/roles/new', element: <RoleFormPage /> },
          { path: 'settings/roles/:id/edit', element: <RoleFormPage /> },
          { path: 'settings/permissions', element: <PermissionsPage /> },
          { path: 'settings/permissions/new', element: <PermissionFormPage /> },
          { path: 'settings/permissions/:id/edit', element: <PermissionFormPage /> },
          { path: 'settings/users', element: <UsersPage /> },
          { path: 'settings/users/new', element: <UserFormPage /> },
          { path: 'settings/users/:id/edit', element: <UserFormPage /> },
          ...PLACEHOLDER_ROUTES.map(([path, label]) => ({
            path,
            element: <ComingSoon label={label} />,
          })),
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);