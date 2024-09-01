import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, Search, Bell, Settings, User, Menu, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./dashboard.css";

// Sample device data
const devices = [
  { id: 1, name: 'Device 1', deviceId: 'D001', location: 'Room 101', status: 'Active' },
  { id: 2, name: 'Device 2', deviceId: 'D002', location: 'Room 102', status: 'Inactive' },
  { id: 3, name: 'Device 3', deviceId: 'D003', location: 'Room 103', status: 'Maintenance' },
  { id: 4, name: 'Device 4', deviceId: 'D004', location: 'Room 104', status: 'Active' },
];

// Sample data for each device
const deviceData = {
  1: {
    lineChart: [
      { name: 'Jan', value: 10 },
      { name: 'Feb', value: 15 },
      { name: 'Mar', value: 20 },
      { name: 'Apr', value: 25 },
      { name: 'May', value: 30 },
      { name: 'Jun', value: 35 },
    ],
    pieChart: [
      { name: 'Category A', value: 400 },
      { name: 'Category B', value: 300 },
      { name: 'Category C', value: 200 },
      { name: 'Category D', value: 100 },
    ],
    tableData: [
      { id: 'FL1-0001', date: '15.1.22', time: '13:01:21', area: 'Area 1' },
      { id: 'FL1-0002', date: '16.1.22', time: '14:02:22', area: 'Area 2' },
      { id: 'FL1-0003', date: '17.1.22', time: '15:03:23', area: 'Area 3' },
    ],
  },
  2: {
    lineChart: [
      { name: 'Jan', value: 20 },
      { name: 'Feb', value: 25 },
      { name: 'Mar', value: 40 },
      { name: 'Apr', value: 15 },
      { name: 'May', value: 20 },
      { name: 'Jun', value: 45 },
    ],
    pieChart: [
      { name: 'Category A', value: 300 },
      { name: 'Category B', value: 400 },
      { name: 'Category C', value: 300 },
      { name: 'Category D', value: 200 },
    ],
    tableData: [
      { id: 'FL2-0004', date: '18.1.22', time: '16:04:24', area: 'Area 4' },
      { id: 'FL2-0005', date: '19.1.22', time: '17:05:25', area: 'Area 5' },
      { id: 'FL2-0006', date: '20.1.22', time: '18:06:26', area: 'Area 6' },
    ],
  },
  3: {
    lineChart: [
      { name: 'Jan', value: 40 },
      { name: 'Feb', value: 30 },
      { name: 'Mar', value: 25 },
      { name: 'Apr', value: 20 },
      { name: 'May', value: 15 },
      { name: 'Jun', value: 0 },
    ],
    pieChart: [
      { name: 'Category A', value: 200 },
      { name: 'Category B', value: 300 },
      { name: 'Category C', value: 400 },
      { name: 'Category D', value: 300 },
    ],
    tableData: [
      { id: 'FL3-0007', date: '21.1.22', time: '19:07:27', area: 'Area 7' },
      { id: 'FL3-0008', date: '22.1.22', time: '20:08:28', area: 'Area 8' },
      { id: 'FL3-0009', date: '23.1.22', time: '21:09:29', area: 'Area 9' },
    ],
  },
  4: {
    lineChart: [
      { name: 'Jan', value: 5 },
      { name: 'Feb', value: 10 },
      { name: 'Mar', value: 15 },
      { name: 'Apr', value: 20 },
      { name: 'May', value: 25 },
      { name: 'Jun', value: 30 },
    ],
    pieChart: [
      { name: 'Category A', value: 100 },
      { name: 'Category B', value: 200 },
      { name: 'Category C', value: 300 },
      { name: 'Category D', value: 400 },
    ],
    tableData: [
      { id: 'FL4-0009', date: '26.1.22', time: '00:12:32', area: 'Area 12' },
      { id: 'FL4-0010', date: '24.1.22', time: '22:10:30', area: 'Area 10' },
      { id: 'FL4-0011', date: '25.1.22', time: '23:11:31', area: 'Area 11' },
      { id: 'FL4-0012', date: '26.1.22', time: '00:12:32', area: 'Area 12' },
    ],
  },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
    const [selectedDevice, setSelectedDevice] = useState(devices[0]);
    const [currentData, setCurrentData] = useState(deviceData[1]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        setCurrentData(deviceData[selectedDevice.id]);
    }, [selectedDevice]);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = (data) => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    };

    const sortedData = getSortedData(currentData.tableData);

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
                <Database className="sidebar-icon active" />
                <Search className="sidebar-icon" onClick={() => navigate('/search')} />
                <div className="sidebar-icon alert-icon">
                    <Bell />
                    
                </div>
                <Settings className="sidebar-icon" />
                <User className="sidebar-icon profile" onClick={handleProfileClick} />
            </div>

            {/* Main content */}
            <div className="main-content">
                <h1 className="dashboard-title">Dashboard</h1>

                <div className="dashboard-content">
                    {/* Device list */}
                    <div className="device-list">
                        <h2>Devices</h2>
                        {devices.map((device) => (
                            <div 
                                key={device.id} 
                                className={`device-item ${device.id === selectedDevice.id ? 'active' : ''}`}
                                onClick={() => setSelectedDevice(device)}
                            >
                                {device.name}
                            </div>
                        ))}
                    </div>

                    {/* Device Information */}
                    <div className="device-info">
                        <h2>Device Information</h2>
                        <div className="info-item">
                            <span className="info-label">Device ID:</span>
                            <span className="info-value">{selectedDevice.deviceId}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Location:</span>
                            <span className="info-value">{selectedDevice.location}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Status:</span>
                            <span className={`info-value status-${selectedDevice.status.toLowerCase()}`}>
                                {selectedDevice.status}
                            </span>
                        </div>
                    </div>

                    {/* Data visualizations */}
                    <div className="data-visualizations">
                        {/* Line Chart */}
                        <div className="chart-container">
                            <h2>{selectedDevice.name} Line Chart</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={currentData.lineChart}>
                                    <XAxis dataKey="name" stroke="#ffffff" />
                                    <YAxis stroke="#ffffff" />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        <div className="chart-container">
                            <h2>{selectedDevice.name} Pie Chart</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={currentData.pieChart}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {currentData.pieChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Table */}
                        <div className="table-container">
                            <h2>{selectedDevice.name} Table Data</h2>
                            <table>
                                <thead>
                                    <tr>
                                        {['id', 'date', 'time', 'area'].map((key) => (
                                            <th key={key} onClick={() => sortData(key)}>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                                {sortConfig.key === key && (
                                                    sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData.map((row) => (
                                        <tr key={row.id}>
                                            <td>{row.id}</td>
                                            <td>{row.date}</td>
                                            <td>{row.time}</td>
                                            <td>{row.area}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;