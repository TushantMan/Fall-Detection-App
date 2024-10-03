import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/register";
import ResetPassword from "./components/reset-password";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/profile";
import Dashboard from "./components/dashboard";
import Search from './components/search';
import Notification from './components/notification';
import Settings from './components/settings';
import { ThemeProvider } from './context/themeContext';
import { NotificationProvider } from './context/notificationContext';
import { auth } from "./components/firebase";
import Loading from './context/loader';
import LandingPage from "./landing/landing";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Retrieve and apply the saved font size from localStorage
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    document.documentElement.style.fontSize = savedFontSize === 'small' ? '12px' : savedFontSize === 'large' ? '18px' : '16px';

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    // You can replace this with a loading spinner or any other loading indicator
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <div className="App" style={{ fontSize: 'inherit' }}>
            <Routes>
              <Route
                path="/"
                element={<LandingPage />}  // Display LandingPage when the app starts
              />
              <Route path="/login" element={
                <div className="auth-wrapper">
                  <div className="auth-inner">
                    <Login />
                  </div>
                </div>
              } />
              <Route path="/register" element={
                <div className="auth-wrapper">
                  <div className="auth-inner">
                    <SignUp />
                  </div>
                </div>
              } />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reset-password" element={
                <div className="auth-wrapper">
                  <div className="auth-inner">
                    <ResetPassword />
                  </div>
                </div>
              } />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route path="/search" element={<Search />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/landing-page" element={<LandingPage />} />
            </Routes>
            <ToastContainer />
          </div>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
