import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Database, Bell, Settings, User, Menu } from 'lucide-react';
import './search.css';

// Dummy data for devices
const dummyDevices = [
    { id: 1, name: 'Device 1' },
    { id: 2, name: 'Device 2' },
    { id: 3, name: 'Device 3' },
    { id: 4, name: 'Device 4' },
];

// Dummy data for device table data
const dummyDeviceData = {
    1: [
        { id: 'FL-0001', date: '15.1.22', time: '13:01:21', area: 'Area 1' },
        { id: 'FL-0002', date: '16.1.22', time: '14:02:22', area: 'Area 2' },
        { id: 'FL-0003', date: '17.1.22', time: '15:03:23', area: 'Area 3' },
    ],
    2: [
        { id: 'FL-0004', date: '18.1.22', time: '16:04:24', area: 'Area 4' },
        { id: 'FL-0005', date: '19.1.22', time: '17:05:25', area: 'Area 5' },
        { id: 'FL-0006', date: '20.1.22', time: '18:06:26', area: 'Area 6' },
    ],
    3: [
        { id: 'FL-0007', date: '21.1.22', time: '19:07:27', area: 'Area 7' },
        { id: 'FL-0008', date: '22.1.22', time: '20:08:28', area: 'Area 8' },
        { id: 'FL-0009', date: '23.1.22', time: '21:09:29', area: 'Area 9' },
    ],
    4: [
        { id: 'FL-0010', date: '24.1.22', time: '22:10:30', area: 'Area 10' },
        { id: 'FL-0011', date: '25.1.22', time: '23:11:31', area: 'Area 11' },
        { id: 'FL-0012', date: '26.1.22', time: '00:12:32', area: 'Area 12' },
    ],
};

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            const results = performSearch(searchTerm, selectedDevice);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, selectedDevice]);

    const performSearch = (term, device) => {
        let allData = [];
        if (device === 'all') {
            Object.values(dummyDeviceData).forEach(data => {
                allData = [...allData, ...data];
            });
        } else {
            allData = dummyDeviceData[device];
        }

        return allData.filter(item =>
            Object.values(item).some(value =>
                value.toString().toLowerCase().includes(term.toLowerCase())
            )
        );
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                <div className="sidebar-icon alert-icon">
                    <Bell />
                </div>
                <Settings className="sidebar-icon" />
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
                        {dummyDevices.map(device => (
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
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Area</th>
                                    <th>Device</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((result, index) => (
                                    <tr key={index}>
                                        <td>{result.id}</td>
                                        <td>{result.date}</td>
                                        <td>{result.time}</td>
                                        <td>{result.area}</td>
                                        <td>{dummyDevices.find(d => d.id === parseInt(selectedDevice))?.name || 'Multiple'}</td>
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