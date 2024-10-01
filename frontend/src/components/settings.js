import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Database, Search, Settings as SettingsIcon, User, Menu, Sun, Moon } from 'lucide-react';
import { NotificationContext } from '../context/notificationContext';
import { ThemeContext } from '../context/themeContext';
import axios from 'axios';
import './settings.css';
import './dashboard.css';

const Settings = () => {
    const { 
        isPushEnabled, 
        togglePushNotifications, 
        notificationCount,
        addNotification
    } = useContext(NotificationContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isGeneratingDevices, setIsGeneratingDevices] = useState(false);
    const [devices, setDevices] = useState([]);
    const [generatingDataForDevice, setGeneratingDataForDevice] = useState({});
    const [language, setLanguage] = useState('en');
    const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');
    const navigate = useNavigate();

    const fetchDevices = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/devices');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
            addNotification('Error fetching devices. Please try again.', { value: 0 });
        }
    }, [addNotification]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    useEffect(() => {
        document.documentElement.style.fontSize = fontSize === 'small' ? '12px' : fontSize === 'large' ? '18px' : '16px';
    }, [fontSize]);

    const handleTogglePush = async () => {
        await togglePushNotifications();
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const generateDummyDevices = async () => {
        setIsGeneratingDevices(true);
        try {
            const response = await axios.post('http://localhost:5001/api/devices/generate');
            if (response.data.device) {
                await fetchDevices();
                addNotification(`New device ${response.data.device.name} added`, { value: 1 });
            } else {
                addNotification(response.data.message, { value: 0 });
            }
        } catch (error) {
            console.error('Error importing device:', error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                addNotification('Error importing device. Please try again.', { value: 0 });
            }
        } finally {
            setIsGeneratingDevices(false);
        }
    };

    const generateDataForDevice = async (deviceId) => {
        const device = devices.find(d => d.id === deviceId);
        
        // Show confirmation dialog
        const confirmMessage = `Are you sure you want to connect to ${device.name}?`;
        if (!window.confirm(confirmMessage)) {
            return; // If user clicks Cancel, do nothing
        }

        setGeneratingDataForDevice(prev => ({ ...prev, [deviceId]: true }));
        try {
            const response = await axios.post(`http://localhost:5001/api/devices/${deviceId}/dataPoints/generate`);
            
            if (response.data && response.data.message) {
                addNotification(`${response.data.message} to ${device.name}`, { value: 6 });
            } else {
                addNotification(`Successfully connected ${device.name}`, { value: 6 });
            }
            
            await fetchDevices();
        } catch (error) {
            console.error('Error importing data:', error);
            const errorMessage = error.response?.data?.message || 'Error importing data. Please try again.';
            addNotification(`${errorMessage} for device ${deviceId}`, { value: 0 });
        } finally {
            setGeneratingDataForDevice(prev => ({ ...prev, [deviceId]: false }));
        }
    };

    const togglePauseDevice = async (deviceId) => {
        try {
            const device = devices.find(d => d.id === deviceId);
            if (!device) {
                throw new Error('Device not found');
            }

            const action = device.paused ? 'resume' : 'pause';
            await axios.post(`http://localhost:5001/api/devices/${deviceId}/${action}`);
            
            setDevices(prevDevices => prevDevices.map(d => 
                d.id === deviceId ? { ...d, paused: !d.paused } : d
            ));

            const actionText = device.paused ? 'Resumed' : 'Paused';
            addNotification(`${actionText} data generation for ${device.name}`, { value: device.paused ? 3 : 2 });
        } catch (error) {
            console.error('Error toggling device pause state:', error);
            const errorAction = error.message === 'Device not found' ? 'finding' : 'updating';
            addNotification(`Error ${errorAction} device ${deviceId}. Please try again.`, { value: 0 });
        }
    };

    const disconnectDevice = async (deviceId) => {
        if (window.confirm('Are you sure you want to disconnect this device? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5001/api/devices/${deviceId}`);
                const device = devices.find(d => d.id === deviceId);
                addNotification(`Disconnected ${device.name}`, { value: 4 });
                setDevices(prevDevices => prevDevices.filter(d => d.id !== deviceId));
            } catch (error) {
                console.error('Error disconnecting device:', error);
                addNotification(`Error disconnecting device ${deviceId}. Please try again.`, { value: 0 });
            }
        }
    };

    /* global google */
    // Function to initialize Google Translate
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    }

    // Function to initialize Google Translate
    function initializeGoogleTranslate() {
        const translateElement = document.createElement('div');
        translateElement.id = 'google_translate_element';
        document.body.appendChild(translateElement);
        googleTranslateElementInit();
    }

    // Function to toggle Google Translate
    function toggleGoogleTranslate(enable) {
        if (enable) {
            initializeGoogleTranslate();
        } else {
            const translateElement = document.getElementById('google_translate_element');
            if (translateElement) {
                translateElement.remove();
            }
        }
    }

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
        toggleGoogleTranslate(selectedLanguage !== 'en');
    };

    const handleFontSizeChange = (event) => {
        const selectedFontSize = event.target.value;
        setFontSize(selectedFontSize);
        localStorage.setItem('fontSize', selectedFontSize);
    };

    return (
        <div className="dashboard settings-page" style={{ fontSize: fontSize === 'small' ? '10px' : fontSize === 'large' ? '20px' : '16px' }}>
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
            <div className="main-content settings-content">
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
                
                <div className="settings-container">
                    <div className="setting-item">
                        <span>Theme</span>
                        <button
                            onClick={toggleTheme}
                            className={`toggle-btn ${isDarkMode ? 'enabled' : 'disabled'}`}
                        >
                            <span className="toggle-slider"></span>
                            <div className="theme-toggle-icon-container">
                                <span className="theme-toggle-icon sun">
                                    <Sun size={20} />
                                </span>
                                <span className="theme-toggle-icon moon">
                                    <Moon size={20} />
                                </span>
                            </div>
                        </button>
                    </div>
                    <p className="setting-description">
                        Switch between dark and light mode.
                    </p>
                </div>

                <div className="settings-container">
                    <div className="setting-item">
                        <span>Language</span>
                        <select value={language} onChange={handleLanguageChange}>
                            <option value="en">English</option>
                            <option value="es">Other</option>
                        </select>
                    </div>
                    <p className="setting-description">
                        Select the language for the application.
                    </p>
                </div>

                <div className="settings-container">
                    <div className="setting-item">
                        <span>Font Size</span>
                        <select value={fontSize} onChange={handleFontSizeChange}>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                    <p className="setting-description">
                        Select the font size for the application.
                    </p>
                </div>

                <div className="settings-container">
                    <div className="devices-section">
                        <h2>Devices</h2>
                        <button
                            className="generate-data-btn"
                            onClick={generateDummyDevices}
                            disabled={isGeneratingDevices}
                        >
                            {isGeneratingDevices ? 'Adding Device...' : 'Add Device'}
                        </button>
                        {devices.length > 0 ? (
                            <div className="device-grid-container two-column-grid">
                                <div className="device-grid">
                                    {devices.map((device) => (
                                        <div key={device.id} className="device-card">
                                            <h3 className="device-name">{device.name}</h3>
                                            <div className="device-info">
                                                <div className="info-item">
                                                    <span className="info-label">Device ID:</span>
                                                    <span className="info-value">{device.id}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Location:</span>
                                                    <span className="info-value">{device.location}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Status:</span>
                                                    <span className={`info-value status-${device.status.toLowerCase()}`}>
                                                        {device.status}
                                                    </span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Device Status:</span>
                                                    <span className={`info-value status-${device.paused ? 'inactive' : 'active'}`}>
                                                        {device.paused ? 'Paused' : 'Active'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="device-actions">
                                                <button
                                                    className="generate-data-btn device-specific"
                                                    onClick={() => generateDataForDevice(device.id)}
                                                    disabled={generatingDataForDevice[device.id] || device.paused}
                                                >
                                                    {generatingDataForDevice[device.id] ? 'Connecting Device...' : 'Connect Device'}
                                                </button>
                                                <button
                                                    className={`pause-btn device-specific ${device.paused ? 'resumed' : ''}`}
                                                    onClick={() => togglePauseDevice(device.id)}
                                                >
                                                    {device.paused ? 'Resume Device' : 'Pause Device'}
                                                </button>
                                                <button
                                                    className="disconnect-btn device-specific"
                                                    onClick={() => disconnectDevice(device.id)}
                                                >
                                                    Disconnect Device
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>No devices added yet. Click 'Add Device' to add a device.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;