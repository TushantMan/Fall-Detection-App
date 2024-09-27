import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Database, Search, Settings as SettingsIcon, User, Menu } from 'lucide-react';
import { NotificationContext } from '../context/notificationContext';
import './settings.css';
import './dashboard.css';

const Settings = () => {
    const { isPushEnabled, togglePushNotifications, notificationCount } = useContext(NotificationContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleTogglePush = async () => {
        await togglePushNotifications();
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard settings-page">
            <button className="hamburger-menu" onClick={toggleSidebar}>
                <Menu />
            </button>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Database className="sidebar-icon" onClick={() => navigate('/')} />
                <Search className="sidebar-icon" onClick={() => navigate('/search')} />
                <div className="sidebar-icon alert-icon" onClick={() => navigate('/notification')}>
                    <Bell />
                    {notificationCount > 0 && <span className="alert-badge">{notificationCount}</span>}
                </div>
                <SettingsIcon className="sidebar-icon active" />
                <User className="sidebar-icon profile" onClick={() => navigate('/profile')} />
            </div>
            <div className="main-content">
                <h1>Settings</h1>
                <div className="settings-container">
                    <div className="setting-item">
                        <span>Push Notifications</span>
                        <button
                            onClick={handleTogglePush}
                            className={`toggle-btn ${isPushEnabled ? 'enabled' : 'disabled'}`}
                        >
                            <span className="toggle-slider"></span>
                            <span className="toggle-text">{isPushEnabled ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>
                    <p className="setting-description">
                        {isPushEnabled
                            ? "Push notifications are enabled. You will receive notifications when fall is detected."
                            : Notification.permission === 'granted'
                                ? "Push notifications are disabled in the app, but still allowed by your browser. Toggle on to receive notifications."
                                : "Push notifications are not enabled. Click the toggle and allow notifications in your browser to enable them."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;