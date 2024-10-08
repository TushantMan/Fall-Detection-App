import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Database, Search, Bell, Settings, User, Menu } from 'lucide-react';
import { NotificationContext } from '../context/notificationContext';
import { ThemeContext } from '../context/themeContext';
import "./auth.css";
import "./dashboard.css";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [emailVerification, setEmailVerification] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const {notificationCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        }
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

  const handleDeleteAccount = async () => {
    if (emailVerification !== userDetails.email) {
      setDeleteError("Email doesn't match. Please try again.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Delete user data from Firestore
        await deleteDoc(doc(db, "Users", user.uid));
        
        // Delete user account
        await user.delete();

        // Sign out and redirect to login page
        await auth.signOut();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
      setDeleteError("Failed to delete account. Please try again later.");
    }
  };

  return (
    <div className={`dashboard-profile ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
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
        <Settings className="sidebar-icon" onClick={() => navigate('/settings')}/>
        <User className="sidebar-icon active" />
      </div>
      <div className="main-content-profile">
        {/* Main content */}
        <div className="profile-content">
          {userDetails ? (
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={userDetails.photo}
                  width={"100%"}
                  style={{ borderRadius: "50%" }}
                  alt=""
                />
              </div>
              <h4>{userDetails.firstName}</h4>
              <div>
                <p>Email: {userDetails.email}</p>
              </div>
              <button className="btn btn-primary mb-4" onClick={handleLogout}>
                Logout
              </button>
              
              <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
                Delete Account
              </button>

              {isDeleteModalOpen && (
                <div className="modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Are you sure you want to delete your account?</h5>
                        <button type="button" className="close" onClick={() => setIsDeleteModalOpen(false)}>
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>This action cannot be undone. Please enter your email address to confirm.</p>
                        <input
                          type="email"
                          className="form-control-modal"
                          placeholder="Enter your email"
                          value={emailVerification}
                          onChange={(e) => setEmailVerification(e.target.value)}
                        />
                        {deleteError && (
                          <div className="alert alert-danger mt-2">
                            {deleteError}
                          </div>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                        <button type="button" className="btn btn-danger-modal" onClick={handleDeleteAccount}>Delete Account</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;