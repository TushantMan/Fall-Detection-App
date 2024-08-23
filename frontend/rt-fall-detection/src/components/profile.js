import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Camera, Database, Search, Bell, Settings, User} from 'lucide-react';
import "./auth.css";
import "./dashboard.css"; 

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate(); // Add this line to define the 'navigate' variable
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

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <Camera className="sidebar-icon" onClick={handleDashboardNavigation} />
        <Database className="sidebar-icon" />
        <Search className="sidebar-icon" />
        <div className="sidebar-icon alert-icon">
          <Bell />
          <span className="alert-badge"></span>
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
            <h3>Welcome {userDetails.firstName}</h3>
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