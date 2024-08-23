import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Camera, Database, Search, Bell, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./dashboard.css";


const fallInsightsData = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 15 },
  { name: 'Mar', value: 40 },
  { name: 'Apr', value: 30 },
  { name: 'May', value: 45 },
  { name: 'Jun', value: 35 },
  { name: 'Jul', value: 50 },
  { name: 'Aug', value: 40 },
  { name: 'Sep', value: 45 },
  { name: 'Oct', value: 35 },
  { name: 'Nov', value: 25 },
  { name: 'Dec', value: 30 },
];

const recordedData = [
  { id: 'FL-0010', date: '15.2.22', time: '13:01:21', area: 'Front View' },
  { id: 'FL-0011', date: '15.2.22', time: '13:01:21', area: 'Back View' },
  { id: 'FL-0012', date: '15.2.22', time: '13:01:21', area: 'Side View' },
  { id: 'FL-0013', date: '15.2.22', time: '13:01:21', area: 'Back View' },
  { id: 'FL-0014', date: '15.2.22', time: '13:01:21', area: 'Front View' },
];

const Dashboard = () => {
    const [selectedCamera, setSelectedCamera] = useState('Camera 4');
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };
  
    return (
        <div className="dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <Camera className="sidebar-icon" />
                <Database className="sidebar-icon" />
                <Search className="sidebar-icon" />
                <div className="sidebar-icon alert-icon">
                    <Bell />
                    <span className="alert-badge">3</span>
                </div>
                <Settings className="sidebar-icon" />
                <User className="sidebar-icon profile" onClick={handleProfileClick} />
            </div>
  
        {/* Main content */}
        <div className="main-content">
          <h1 className="dashboard-title">Dashboard</h1>
  
          {/* Camera selection */}
          <div className="camera-controls">
            <span>Watching</span>
            <select>
              <option>List</option>
            </select>
            <select>
              <option>All Cameras</option>
            </select>
          </div>
  
          <div className="camera-section">
            {/* Camera list */}
            <div className="camera-list">
              {['Camera 1', 'Camera 2', 'Camera 3', 'Camera 4'].map((camera) => (
                <div 
                  key={camera} 
                  className={`camera-item ${camera === selectedCamera ? 'active' : ''}`}
                  onClick={() => setSelectedCamera(camera)}
                >
                  {camera}
                  {camera === selectedCamera && (
                    <div className="camera-views">
                      <div>Front View</div>
                      <div>Back View</div>
                      <div>Side View</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
  
            {/* Camera feed */}
            <div className="camera-feed">
              <img src="/api/placeholder/800/450" alt="Camera Feed" />
              <div className="camera-overlay">Camera 4 • Front View</div>
              <div className="time-overlay">15/Aug/2024 01:00 PM</div>
              <div className="fall-detection">Fall Detected</div>
            </div>
          </div>
  
          {/* Details and Recorded Data */}
          <div className="dashboard-bottom">
            <div className="details-section">
              <div className="details-card">
                <h3>Details</h3>
                <div className="stats">
                  <div className="stat-item">
                    <div className="circular-progress" style={{'--progress': '75deg'}} data-progress="10">
                    </div>
                    <div className="stat-label">Increase by 10<br/>Last 4 weeks</div>
                  </div>
                  <div className="stat-item">
                    <div className="circular-progress" style={{'--progress': '270deg'}} data-progress="75">
                    </div>
                    <div className="stat-label">Increase by 75<br/>Last 6 months</div>
                  </div>
                </div>
              </div>
              <div className="details-card">
                <h3>Weekly Falls</h3>
                <div className="stat-value">15</div>
                <div className="weekly-falls">
                  {[3, 5, 2, 7, 4, 6, 8].map((value, index) => (
                    <div key={index} className="bar" style={{ height: `${value * 10}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="recorded-data">
              <h3>Recorded Data</h3>
              <div className="data-header">
                <span>5,000 records</span>
                <span>No of row in table: 5</span>
                <select>
                  <option>Sort by</option>
                </select>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Incident No.</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Area</th>
                  </tr>
                </thead>
                <tbody>
                  {recordedData.map((record, index) => (
                    <tr key={record.id}>
                      <td>{index + 1}</td>
                      <td>{record.id}</td>
                      <td>{record.date}</td>
                      <td>{record.time}</td>
                      <td>{record.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Fall Insights */}
          <div className="fall-insights">
            <h3>Fall Insights</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fallInsightsData}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;