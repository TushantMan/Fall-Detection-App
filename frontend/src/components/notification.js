import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Database, Search, Settings, User, Menu, Trash2 } from 'lucide-react';
import { NotificationContext } from '../context/notificationContext';
import './notification.css';
import './dashboard.css';

const Notification = () => {
    const { notifications, clearAllNotifications, notificationCount } = useContext(NotificationContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard notification-page">
            <button className="hamburger-menu" onClick={toggleSidebar}>
                <Menu />
            </button>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Database className="sidebar-icon" onClick={() => navigate('/')} />
                <Search className="sidebar-icon" onClick={() => navigate('/search')} />
                <div className="sidebar-icon alert-icon active">
                    <Bell />
                    {notificationCount > 0 && <span className="alert-badge">{notificationCount}</span>}
                </div>
                <Settings className="sidebar-icon" />
                <User className="sidebar-icon profile" onClick={() => navigate('/profile')} />
            </div>
            <div className="main-content">
                <h1>Notifications</h1>
                {notifications.length > 0 && (
                    <button className="clear-all-btn" onClick={clearAllNotifications}>
                        <Trash2 size={16} /> Clear All
                    </button>
                )}
                <div className="notifications-list">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className="notification-item">
                                <p>{notification.message}</p>
                                <span className="timestamp">{new Date(notification.timestamp).toLocaleString()}</span>
                            </div>
                        ))
                    ) : (
                        <p>No notifications</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notification;