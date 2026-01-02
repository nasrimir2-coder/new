import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BlogPage from './pages/BlogPage';
import AdminPage from './pages/AdminPage';

// Secret admin routes - only you know these URLs
const SECRET_LOGIN_PATH = '/fahmy-secure-auth';
const SECRET_ADMIN_PATH = '/fahmy-control-panel';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path={SECRET_LOGIN_PATH} element={<LoginPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path={SECRET_ADMIN_PATH} element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
