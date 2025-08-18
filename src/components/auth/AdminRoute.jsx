import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { currentUser, userData } = useAuth();

  // 1. Check if a user is logged in.
  // 2. Check if the logged-in user has the 'admin' role.
  if (currentUser && userData?.role === 'admin') {
    // If both are true, show the page they are trying to access.
    return children;
  }

  // If either check fails, redirect them to the homepage.
  return <Navigate to="/" />;
}

export default AdminRoute;