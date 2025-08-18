// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/auth/AdminRoute';
import './index.css'; // Make sure this line is here and correct

// Import all page components
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import PostEditor from './pages/PostEditor.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import NoticeBoardPage from './pages/NoticeBoardPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import OpportunitiesPage from './pages/OpportunitiesPage.jsx';
import StudyMaterialsPage from './pages/StudyMaterialsPage.jsx';
import SuccessStoriesPage from './pages/SuccessStoriesPage.jsx';
import ViewPostPage from './pages/ViewPostPage.jsx';
import BatchmatesPage from './pages/BatchmatesPage.jsx';
import FindSeniorsPage from './pages/FindSeniorsPage.jsx';
import ViewUserProfilePage from './pages/ViewUserProfilePage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import ViewQuestionPage from './pages/ViewQuestionPage.jsx';
import PostImportantNoticePage from './pages/PostImportantNoticePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      
      // Logged-in user routes
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/create-post', element: <CreatePostPage /> },
      { path: '/post-editor/:category', element: <PostEditor /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/notice-board', element: <NoticeBoardPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/opportunities', element: <OpportunitiesPage /> },
      { path: '/study-materials', element: <StudyMaterialsPage /> },
      { path: '/success-stories', element: <SuccessStoriesPage /> },
      { path: '/batchmates', element: <BatchmatesPage /> },
      { path: '/find-seniors', element: <FindSeniorsPage /> },
      { path: '/post/:postId', element: <ViewPostPage /> }, 
      { path: '/user/:userId', element: <ViewUserProfilePage /> },
      { path: '/help', element: <HelpPage /> },
      { path: '/help/question/:questionId', element: <ViewQuestionPage /> },
      
      // Admin-only routes
      {
        path: '/admin',
        element: <AdminRoute><AdminPage /></AdminRoute>,
      },
      {
        path: '/post-important-notice',
        element: <AdminRoute><PostImportantNoticePage /></AdminRoute>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
