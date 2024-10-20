import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,BarChart, Bar } from 'recharts';
import { Database, Search, Bell, Settings, User, Menu, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NotificationContext } from '../context/notificationContext';
import { ThemeContext } from '../context/themeContext';
import FallMap from './fallmap';
import "./dashboard.css";

const COLORS = ['rgba( 255, 0, 0, 0.8 )', 'rgba(0, 89, 255, 0.8)', '#00ff40','#eeff00'];
const ITEMS_PER_PAGE = 10;

const AREA_COORDINATES = {
    'Room 101': { latitude: -37.72126655951144, longitude: 145.04660447207385 },
    'Room 102': { latitude: -37.71913798559095, longitude: 145.0457860400447 },
    'Room 103': { latitude: -37.721042911261975, longitude: 145.05266516274372 },
    'Room 104': { latitude: -37.719899341263016, longitude: 145.0484659363904 },
  };

const Dashboard = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    const [allDevicesData, setAllDevicesData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const { addNotification } = useContext(NotificationContext);
    const { notificationCount } = useContext(NotificationContext);
    const { isDarkMode } = useContext(ThemeContext);
    const [latestDataPoint, setLatestDataPoint] = useState(null);
    const [areaFallData, setAreaFallData] = useState([]);
    const navigate = useNavigate();

    // Function to fetch devices
    const fetchDevices = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/devices');
            setDevices(response.data);
            if (response.data.length > 0) {
                setSelectedDevice({ id: 'all', name: 'All Devices' }); // Select 'All Devices' by default
            }
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    }, []);

    const processAreaFallData = useMemo(() => (data) => {
        const areaFalls = data.reduce((acc, point) => {
            if (point.label === 1) { // Assuming 1 represents a fall
                if (!acc[point.area]) {
                    acc[point.area] = { 
                        area: point.area,
                        falls: 0,
                        ...AREA_COORDINATES[point.area] // Add coordinates from our frontend mapping
                    };
                }
                acc[point.area].falls += 1;
            }
            return acc;
        }, {});

        return Object.values(areaFalls).sort((a, b) => b.falls - a.falls);
    }, []);
    // Function to fetch data for all devices
    const fetchAllDevicesData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/datapoints');
            const data = response.data;
            
            // Process data for charts
            const lineChartData = processLineChartData(data);
            const pieChartData = processPieChartData(data);
            const areaFallData = processAreaFallData(data);

            setAllDevicesData({
                lineChart: lineChartData,
                pieChart: pieChartData,
                tableData: data
            });
            setAreaFallData(areaFallData);
        } catch (error) {
            console.error('Error fetching data for all devices:', error);
        }
    }, [processAreaFallData]); 

    
    // Function to fetch data for a selected device
    const fetchDeviceData = useCallback(async (deviceId) => {
        if (deviceId === 'all') {
            await fetchAllDevicesData();
        } else {
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
        }
    }, [fetchAllDevicesData]);

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

    const fetchLatestDataPoint = useCallback(async () => {
        if (selectedDevice && selectedDevice.id !== 'all') {
            try {
                const response = await axios.get(`http://localhost:5001/api/devices/${selectedDevice.id}/dataPoints/latest`);
                const newDataPoint = response.data;
        
                if (!latestDataPoint || newDataPoint.id !== latestDataPoint.id) {
                    setLatestDataPoint(newDataPoint);
                    if (newDataPoint.value === 6 || newDataPoint.value === 7) {
                        addNotification(`New fall detected by ${selectedDevice.name} in ${newDataPoint.area}`, newDataPoint);
                    }
                }
            } catch (error) {
                console.error('Error fetching the latest data point:', error);
            }
        }
    }, [selectedDevice, latestDataPoint, addNotification]);
    
    useEffect(() => {
        if (selectedDevice && selectedDevice.id !== 'all') {
            const intervalId = setInterval(fetchLatestDataPoint, 5000);
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [selectedDevice, fetchLatestDataPoint]);

    useEffect(() => {
        if (latestDataPoint && selectedDevice && selectedDevice.id !== 'all') {
            fetchDeviceData(selectedDevice.id);
        }
    }, [latestDataPoint, selectedDevice, fetchDeviceData]);

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

    const sortedData = selectedDevice?.id === 'all' ? 
        (allDevicesData ? getSortedData(allDevicesData.tableData) : []) : 
        (deviceData ? getSortedData(deviceData.tableData) : []);
    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
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
                <Settings className="sidebar-icon" onClick={() => navigate('/settings')}/>
                <User className="sidebar-icon profile" onClick={() => navigate('/profile')} />
            </div>

            {/* Main content */}
            <div className="main-content">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="dashboard-content">
                    {/* Device list */}
                    <div className="device-list">
                        <h2>Devices</h2>
                        <div 
                            key="all"
                            className={`device-item ${selectedDevice?.id === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedDevice({ id: 'all', name: 'All Devices' })}
                        >
                            All Devices
                        </div>
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
                    {selectedDevice && (selectedDevice.id === 'all' ? allDevicesData : deviceData) && (
                        <>
                            <div className="device-info">
                                <h2>Device Information</h2>
                                {selectedDevice.id === 'all' ? (
                                    <div className="info-item">
                                        <span className="info-label">Total Devices:</span>
                                        <span className="info-value">{devices.length}</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="info-item">
                                            <span className="info-label">Device ID:</span>
                                            <span className="info-value">{selectedDevice.id}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Location:</span>
                                            <span className="info-value">{selectedDevice.location}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Connection:</span>
                                            <span className={`info-value status-${selectedDevice.status.toLowerCase()}`}>
                                                {selectedDevice.status}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Data Visualizations */}
                            <div className="data-visualizations">
                                {/* Line Chart */}
                                <div className="chart-container">
                                    <h2>{selectedDevice.name} Monthly Fall Percentage</h2>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={selectedDevice.id === 'all' ? allDevicesData.lineChart : deviceData.lineChart}>
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
                                    <h2>{selectedDevice.name} Pie Chart (Fall & Non-Fall)</h2>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={selectedDevice.id === 'all' ? allDevicesData.pieChart : deviceData.pieChart}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {(selectedDevice.id === 'all' ? allDevicesData.pieChart : deviceData.pieChart).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {selectedDevice.id === 'all' && (
                                <div className="area-fall-data-container">
                                    <div className="chart-container">
                                        <h2>Falls by Area</h2>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={areaFallData}>
                                                <XAxis dataKey="area" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="falls" fill="#000">
                                                    {areaFallData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="chart-container">
                                        <h2>Fall Locations</h2>
                                        <FallMap areaFallData={areaFallData} />
                                    </div>
                                </div>
                            )}
                                {/* Table */}
                                <div className="table-container">
                                    <h2>{selectedDevice.name} Table Data</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                {['id', 'timestamp', 'value', 'category', 'label', 'area', 'deviceId'].map((key) => (
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
                                    <td>{row.deviceId}</td>
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