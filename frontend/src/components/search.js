import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Database, Bell, Settings, User, Menu } from 'lucide-react';
import axios from 'axios';
import { NotificationContext } from '../context/notificationContext';
import './search.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [devices, setDevices] = useState([]);
    const [allDataPoints, setAllDataPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {notificationCount } = useContext(NotificationContext);
    const navigate = useNavigate();

    const fetchDevices = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:5001/api/devices');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
            setError('Failed to fetch devices. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchAllDataPoints = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:5001/api/datapoints');
            setAllDataPoints(response.data);
        } catch (error) {
            console.error('Error fetching data points:', error);
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const performSearch = useCallback((term, deviceId) => {
        let dataToSearch = allDataPoints;
        if (deviceId !== 'all') {
            dataToSearch = allDataPoints.filter(point => point.deviceId.toString() === deviceId);
        }

        return dataToSearch.filter(item =>
            Object.values(item).some(value =>
                value.toString().toLowerCase().includes(term.toLowerCase())
            )
        );
    }, [allDataPoints]);

    useEffect(() => {
        fetchDevices();
        fetchAllDataPoints();
    }, [fetchDevices, fetchAllDataPoints]);

    useEffect(() => {
        if (searchTerm) {
            const results = performSearch(searchTerm, selectedDevice);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, selectedDevice, performSearch]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="dashboard search-page">
            {/* Hamburger menu for mobile */}
            <button className="hamburger-menu" onClick={toggleSidebar}>
                <Menu />
            </button>

            {/* Sidebar overlay */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Database className="sidebar-icon" onClick={() => navigate('/')} />
                <SearchIcon className="sidebar-icon active" />
                <div className="sidebar-icon alert-icon" onClick={() => navigate('/notification')}>
                    <Bell />
                    {notificationCount > 0 && <span className="alert-badge">{notificationCount}</span>}
                </div>
                <Settings className="sidebar-icon" onClick={() => navigate('/settings')}/>
                <User className="sidebar-icon profile" onClick={() => navigate('/profile')} />
            </div>

            {/* Main content */}
            <div className="main-content">
                <div className="search-header">
                    <h1>Search Data</h1>
                </div>
                <div className="search-container">
                    <div className="search-input-container">
                        <SearchIcon className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        className="device-select"
                    >
                        <option value="all">All Devices</option>
                        {devices.map(device => (
                            <option key={device.id} value={device.id}>{device.name}</option>
                        ))}
                    </select>
                </div>
                <div className="search-results">
                    {searchResults.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Timestamp</th>
                                    <th>Value</th>
                                    <th>Category</th>
                                    <th>Label</th>
                                    <th>Area</th>
                                    <th>Device</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((result) => (
                                    <tr key={result.id}>
                                        <td>{result.id}</td>
                                        <td>{new Date(result.timestamp).toLocaleString()}</td>
                                        <td>{result.value}</td>
                                        <td>{result.category}</td>
                                        <td>{result.label === 0 ? 'Non-Fall' : 'Fall'}</td>
                                        <td>{result.area}</td>
                                        <td>{devices.find(d => d.id === result.deviceId)?.name || 'Unknown'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : searchTerm ? (
                        <p>No results found</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Search;