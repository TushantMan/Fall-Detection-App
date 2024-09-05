import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, Search, Bell, Settings, User, Menu, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./dashboard.css";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isGeneratingDevices, setIsGeneratingDevices] = useState(false);
    const [isGeneratingData, setIsGeneratingData] = useState(false);
    const navigate = useNavigate();

    // Function to fetch devices
    const fetchDevices = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/devices');
            setDevices(response.data);
            if (response.data.length > 0) {
                setSelectedDevice(response.data[0]); // Select the first device by default
            }
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    }, []);

    // Function to fetch data for a selected device
    const fetchDeviceData = useCallback(async (deviceId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/devices/${deviceId}/dataPoints`);
            const data = response.data;
            
            // Process data for charts
            const lineChartData = processLineChartData(data);
            const pieChartData = processPieChartData(data);

            setDeviceData({
                lineChart: lineChartData,
                pieChart: pieChartData,
                tableData: data
            });
        } catch (error) {
            console.error('Error fetching device data:', error);
        }
    }, []); // Memoize this function to prevent unnecessary re-renders

    // Fetch devices once the component is mounted
    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    // Fetch device data when a new device is selected
    useEffect(() => {
        if (selectedDevice) {
            fetchDeviceData(selectedDevice.id);
        }
    }, [selectedDevice, fetchDeviceData]);

    // Function to generate dummy devices
    const generateDummyDevices = async () => {
        setIsGeneratingDevices(true);
        try {
            await axios.post('http://localhost:5001/api/devices/generate');
            await fetchDevices(); // Refresh the device list after generating devices
            alert('Dummy devices generated successfully!');
        } catch (error) {
            console.error('Error generating dummy devices:', error);
            alert('Error generating dummy devices. Please try again.');
        } finally {
            setIsGeneratingDevices(false);
        }
    };

    // Function to generate dummy data
    const generateDummyData = async () => {
        if (!selectedDevice) {
            alert('Please select a device first.');
            return;
        }
        setIsGeneratingData(true);
        try {
            await axios.post(`http://localhost:5001/api/devices/${selectedDevice.id}/dataPoints/generate`);
            await fetchDeviceData(selectedDevice.id); // Refresh the data for the selected device
            alert('Dummy data generated successfully!');
        } catch (error) {
            console.error('Error generating dummy data:', error);
            alert('Error generating dummy data. Please try again.');
        } finally {
            setIsGeneratingData(false);
        }
    };

    // Process data for the line chart
    const processLineChartData = (data) => {
        // Simplified example: aggregate data by month
        return data.slice(0, 6).map(point => ({
            name: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short' }),
            value: point.value
        }));
    };

    // Process data for the pie chart
    const processPieChartData = (data) => {
        // Simplified example: group data by area
        const areaCount = data.reduce((acc, point) => {
            acc[point.area] = (acc[point.area] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(areaCount).map(([name, value]) => ({ name, value }));
    };

    // Function to sort table data
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Function to get sorted table data
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

    const sortedData = deviceData ? getSortedData(deviceData.tableData) : [];

    return (
        <div className="dashboard">
            {/* Sidebar and Menu */}
            <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu />
            </button>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Database className="sidebar-icon" />
                <Search className="sidebar-icon" onClick={() => navigate('/search')} />
                <div className="sidebar-icon alert-icon">
                    <Bell />
                </div>
                <Settings className="sidebar-icon" />
                <User className="sidebar-icon profile" onClick={() => navigate('/profile')} />
            </div>

            {/* Main content */}
            <div className="main-content">
                <h1 className="dashboard-title">Dashboard</h1>
                
                {/* Data Generation Buttons */}
                <button 
                    className="generate-data-btn" 
                    onClick={generateDummyDevices}
                    disabled={isGeneratingDevices}
                >
                    {isGeneratingDevices ? 'Generating Devices...' : 'Generate Dummy Devices'}
                </button>

                <button 
                className="generate-data-btn" 
                onClick={generateDummyData}
                disabled={isGeneratingData || !selectedDevice}
            >
                {isGeneratingData ? 'Generating Data...' : 'Generate Dummy Data'}
            </button>

                <div className="dashboard-content">
                    {/* Device list */}
                    <div className="device-list">
                        <h2>Devices</h2>
                        {devices.map((device) => (
                            <div 
                                key={device.id} 
                                className={`device-item ${device.id === selectedDevice?.id ? 'active' : ''}`}
                                onClick={() => setSelectedDevice(device)}
                            >
                                {device.name}
                            </div>
                        ))}
                    </div>

                    {/* Display device data */}
                    {selectedDevice && deviceData && (
                        <>
                            {/* Device Information */}
                            <div className="device-info">
                                <h2>Device Information</h2>
                                <div className="info-item">
                                    <span className="info-label">Device ID:</span>
                                    <span className="info-value">{selectedDevice.id}</span>
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

                            {/* Data Visualizations */}
                            <div className="data-visualizations">
                                {/* Line Chart */}
                                <div className="chart-container">
                                    <h2>{selectedDevice.name} Line Chart</h2>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={deviceData.lineChart}>
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
                                                data={deviceData.pieChart}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {deviceData.pieChart.map((entry, index) => (
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
                                                {['id', 'timestamp', 'value', 'area'].map((key) => (
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
                                                    <td>{new Date(row.timestamp).toLocaleString()}</td>
                                                    <td>{row.value}</td>
                                                    <td>{row.area}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
