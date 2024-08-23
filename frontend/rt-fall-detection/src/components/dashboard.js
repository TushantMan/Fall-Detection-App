import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Camera, Database, Search, Bell, Settings, User, Maximize, Minimize } from 'lucide-react';// Import Minimize component
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

const cameraFeeds = {
    'Camera 1': 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    'Camera 2': 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
    'Camera 3': 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    'Camera 4': 'https://samplelib.com/lib/preview/mp4/sample-20s.mp4'
  };
  
  const Dashboard = () => {
    const [selectedCamera, setSelectedCamera] = useState('Camera 1');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isFullScreen, setIsFullScreen] = useState(false);
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const videoContainerRef = useRef(null);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [selectedCamera]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            if (videoContainerRef.current.requestFullscreen) {
                videoContainerRef.current.requestFullscreen();
            } else if (videoContainerRef.current.mozRequestFullScreen) { // Firefox
                videoContainerRef.current.mozRequestFullScreen();
            } else if (videoContainerRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
                videoContainerRef.current.webkitRequestFullscreen();
            } else if (videoContainerRef.current.msRequestFullscreen) { // IE/Edge
                videoContainerRef.current.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <Camera className="sidebar-icon active" />
                <Database className="sidebar-icon" />
                <Search className="sidebar-icon" />
                <div className="sidebar-icon alert-icon">
                    <Bell />
                    <span className="alert-badge"></span>
                </div>
                <Settings className="sidebar-icon" />
                <User className="sidebar-icon" onClick={handleProfileClick} />
            </div>

            {/* Main content */}
            <div className="main-content">
                <h1 className="dashboard-title">Dashboard</h1>

                {/* Camera selection */}
                <div className="camera-controls">
                    <h5>Watching</h5>
                    <select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)}>
                        {Object.keys(cameraFeeds).map(camera => (
                            <option key={camera} value={camera}>{camera}</option>
                        ))}
                    </select>
                </div>

                <div className="camera-section">
                    {/* Camera list */}
                    <div className="camera-list">
                        {Object.keys(cameraFeeds).map((camera) => (
                            <div 
                                key={camera} 
                                className={`camera-item ${camera === selectedCamera ? 'active' : ''}`}
                                onClick={() => setSelectedCamera(camera)}
                            >
                                {camera}
                            </div>
                        ))}
                    </div>

                    {/* Camera feed */}
                    <div className="camera-feed" ref={videoContainerRef}>
                        <video ref={videoRef} width="100%" height="auto" autoPlay loop muted>
                            <source src={cameraFeeds[selectedCamera]} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="camera-overlay">{selectedCamera}</div>
                        <div className="time-overlay">
                            <div>{formatDate(currentTime)}</div>
                            <div>{formatTime(currentTime)}</div>
                        </div>
                        <div className="fall-detection">Fall Detected</div>
                        <button className="fullscreen-button" onClick={toggleFullScreen}>
                            {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
                        </button>
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
                <div className='camera-controls'>
                <select>
                  <option>Sort by</option>
                </select>
                </div>
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