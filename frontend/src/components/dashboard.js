import React, { useState, useEffect, useCallback, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, Search, Bell, Settings, User, Menu, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NotificationContext } from '../context/notificationContext';
import "./dashboard.css";

const COLORS = ['#FF0000', '#0088FE'];
const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isGeneratingDevices, setIsGeneratingDevices] = useState(false);
    const [isGeneratingData, setIsGeneratingData] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { addNotification } = useContext(NotificationContext);
    const {notificationCount } = useContext(NotificationContext);
    
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
            alert('Devices generated successfully!');
        } catch (error) {
            console.error('Error generating devices:', error);
            alert('Error generating devices. Please try again.');
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
            await fetchDeviceData(selectedDevice.id);
            addNotification(`Fall Detected in ${selectedDevice.name}`);
            alert('Data generated successfully!');
        } catch (error) {
            console.error('Error generating data:', error);
            alert('Error generating data. Please try again.');
        } finally {
            setIsGeneratingData(false);
        }
    };

    // Process data for the line chart
    const processLineChartData = (data) => {
        // Group data by month and calculate the percentage of falls
        const groupedData = data.reduce((acc, point) => {
            const date = new Date(point.timestamp);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!acc[monthYear]) {
                acc[monthYear] = { total: 0, falls: 0 };
            }
            acc[monthYear].total++;
            if (point.label === 1) {
                acc[monthYear].falls++;
            }
            return acc;
        }, {});

        return Object.entries(groupedData)
            .map(([monthYear, counts]) => ({
                name: monthYear,
                value: (counts.falls / counts.total) * 100
            }))
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort by date
    };

    const processPieChartData = (data) => {
        const labelCounts = data.reduce((acc, point) => {
            const labelName = point.label === 0 ? 'Non-Fall' : 'Fall';
            acc[labelName] = (acc[labelName] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(labelCounts).map(([name, value]) => ({ name, value }));
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
    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="dashboard">
            {/* Sidebar and Menu */}
            <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu />
            </button>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Database className="sidebar-icon active" />
                <Search className="sidebar-icon" onClick={() => navigate('/search')} />
                <div className="sidebar-icon alert-icon" onClick={() => navigate('/notification')}>
                <Bell/>
                    {notificationCount > 0 && <span className="alert-badge">{notificationCount}</span>}
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
                    {isGeneratingDevices ? 'Importing Devices...' : 'Import Devices'}
                </button>

                <button 
                className="generate-data-btn" 
                onClick={generateDummyData}
                disabled={isGeneratingData || !selectedDevice}
            >
                {isGeneratingData ? 'Importing Data...' : 'Import Data'}
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
                <h2>{selectedDevice.name} Monthly Fall Percentage</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={deviceData.lineChart}>
                        <XAxis 
                            dataKey="name" 
                            stroke="#ffffff"
                            tickFormatter={(tick) => {
                                const [year, month] = tick.split('-');
                                return `${month}/${year.slice(2)}`;
                            }}
                        />
                        <YAxis 
                            stroke="#ffffff"
                            tickFormatter={(tick) => `${tick}%`}
                        />
                        <Tooltip 
                            formatter={(value) => [`${value.toFixed(2)}%`, 'Fall Percentage']}
                            labelFormatter={(label) => {
                                const [year, month] = label.split('-');
                                return `${month}/${year}`;
                            }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={2} 
                            dot={false}
                        />
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
                            {['id', 'timestamp', 'value', 'category', 'label', 'area'].map((key) => (
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
                        {getPaginatedData().map((row) => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{new Date(row.timestamp).toLocaleString()}</td>
                                <td>{row.value}</td>
                                <td>{row.category}</td>
                                <td>{row.label === 0 ? 'Non-Fall' : 'Fall'}</td>
                                <td>{row.area}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span>{currentPage} of {totalPages}</span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
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
