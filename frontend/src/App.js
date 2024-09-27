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
import { NotificationProvider } from './context/notificationContext';
import { auth } from "./components/firebase";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <NotificationProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
    </NotificationProvider>
  );
}

export default App;