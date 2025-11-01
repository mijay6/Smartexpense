//import { useState } from 'react'
import { BrowserRouter , Routes, Route, Navigate} from 'react-router-dom';
import { useEffect } from 'react';
import { authStore } from './stores/authStore';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Expenses from './pages/Expenses.jsx';
import ToastContainer from './components/shared/ToastContainer.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = authStore();
  return isAuthenticated ? <>{children}</>: <Navigate to="/login" />;
}

function App() {

  const { checkAuth, isInitialized } = authStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Root route redirects based on authentication */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route 
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        {/* Page not found */}
        <Route
          path="*" 
          element= {
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">404 - Page not found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
