import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Database, Search, Bell, Settings, User, Menu } from 'lucide-react';
import { NotificationContext } from '../context/notificationContext';
import "./auth.css";
import "./dashboard.css";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {notificationCount } = useContext(NotificationContext);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      {/* Hamburger menu for mobile */}
      <button className="hamburger-menu" onClick={toggleSidebar}>
        <Menu />
      </button>

      {/* Sidebar overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Database className="sidebar-icon" onClick={handleDashboardNavigation} />
        <Search className="sidebar-icon" onClick={() => navigate('/search')}/>
        <div className="sidebar-icon alert-icon" onClick={() => navigate('/notification')}>
        <Bell />
                    {notificationCount > 0 && <span className="alert-badge">{notificationCount}</span>}
                </div>
        <Settings className="sidebar-icon" />
        <User className="sidebar-icon active" />
      </div>

      {/* Main content */}
      <div className="auth-inner">
        {userDetails ? (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={userDetails.photo}
                width={"40%"}
                style={{ borderRadius: "50%" }}
                alt=""
              />
            </div>
            <h3>{userDetails.firstName}</h3>
            <div>
              <p>Email: {userDetails.email}</p>
            </div>
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;