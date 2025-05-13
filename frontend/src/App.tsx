import { Navigate, Route, Routes } from 'react-router';
import '@mantine/core/styles.css';

import AuthProvider from './contexts/AuthContext';
import LoginPage from './routes/LoginPage';
import PageLayout from './PageLayout';
import HomePage from './routes/HomePage';
import ReservationsPage from './routes/ReservationsPage';
import LoyaltyPage from './routes/LoyaltyPage';
import AdminReservationsPage from './routes/AdminReservationsPage';
import AccountPage from './routes/AccountPage';
import ProtectedRoute from './routes/ProtectedRoute';
import './App.css'

/**
 * App infrastructure
 * AuthProvider wraps app so that child components can have access to logged in users
 * Routes & Route handling the page routing
 */
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/loyalty" element={<LoyaltyPage />} />
          <Route path="/account" element={<AccountPage />} />
          
          {/* Staff/Admin Routes */}
          <Route path="/admin/reservations" element={<AdminReservationsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App
