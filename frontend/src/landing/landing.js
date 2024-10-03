import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Radar, Siren, Pointer, TabletSmartphone, Zap, EyeOff} from 'lucide-react';
import './landing.css';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
        title: "Ease of Use",
        description: "Our dashboard is designed to be intuitive, with clear graphs and reports, even for non-technical users.",
        icon: <Pointer size={60}/>
      },
    {
      title: "Customizable Alerts",
      description: "Configure alert thresholds and choose how notifications are delivered, making it easy to tailor the system to your needs.",
      icon: <Siren size={60}/>
    },
    
    {
        title: "High Accuracy",
        description: "Radar technology minimizes false alarms, ensuring that only real falls trigger alerts.",
        icon: <Radar size={60}/>
      },
    {
        title: "Multiplatform Support",
        description: "Our dashboard is designed to be intuitive, with clear graphs and reports, even for non-technical users.",
        icon: <TabletSmartphone size={60}/>
      }
  ];
  return (
    <div className="landing-page">
    <div className='landing-main'>
      <header className="header">
        <div className="header-content">
          <img src="Fall_Guys_Logo.png" alt="Fall Guys Logo" className="logo" />
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <a href="#Home">Home</a>
            <a href="#choose">Why Fall Guys</a>
            <a href="#enterprise">Enterprise Features</a>
            <a href="#works">How It Works</a>
            <a href="#login" onClick={() => navigate('/login')}>Sign Up</a>
          </nav>
        </div>
      </header>

      <main>
        <section className={`hero ${isVisible ? 'visible' : ''}`} id='Home'>
          <div className="hero-content">
            <h1>Minimize Risks, Maximize Safety</h1>
            <p>Real-time fall detection using radar, no wearables, ensuring privacy and non-invasive monitoring.</p>
            <button className="cta-button"  onClick={() => navigate('/login')}>SIGN UP</button>
          </div>
          <div className="hero-image">
            <img src="Hero.png" alt="Fall Guys in action" className='main-logo'/>
          </div>
        </section>

        <h1 className='main-stats'>Why Choose Fall Guys over Others</h1>
        <section className={`stats ${isVisible ? 'visible' : ''}`} id='choose'>
        
          <div className="stat">
            <Zap size={60} />
            <h3>Real-Time Detection</h3>
            <p>Instantly detects and alerts in case of a fall, ensuring rapid response.
            </p>
          </div>
          <div className="stat">
          <EyeOff size={60} />
            <h3>Privacy-Focused</h3>
            <p>Non-invasive radar technology—no cameras or wearables required</p>
          </div>
          <div className="stat">
          <TabletSmartphone size={60}/>
            <h3>Cross-Platform</h3>
            <p>Accessible 24/7 on web, macOS, Windows, Linux, and Android.</p>
          </div>
        </section>

        <section className="features" id='enterprise'>
          <h2>Take a deeper dive into a new way to visualize fall data</h2>
          <div className="feature-tabs">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`feature-tab ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
              >
                {feature.title}
              </button>
            ))}
          </div>
          <div className="feature-content">
            <h3 className='title-features'>{features[activeFeature].title}</h3>
            <p>{features[activeFeature].description}</p>
            <a href="#learn-more" className="learn-more">
              Learn more <ArrowRight size={20} />
            </a>
          </div>
          <div className="feature-image">
            <img src={`Desktop-1200-${activeFeature + 1}.png`} alt={features[activeFeature].title} />
          </div>
        </section>

        <section className="teams">
          <h2>Do more with AI that works where you do</h2>
          <p>Fall Guys securely scales up to support the big data using Machine Learning and AI.</p>
          <div className="team-logos">
            <img src='Tech Stack/aws.webp' className='team-logos-img' alt='aws'/>
            <img src='Tech Stack/docker.png' className='team-logos-img' alt='docker'/>
            <img src='Tech Stack/matlab.png' className='team-logos-img' alt='matlab'/>
            <img src='Tech Stack/Nginx.png' className='team-logos-img' alt='nginx'/>
            <img src='Tech Stack/node.png' className='team-logos-img' alt='node'/>
            <img src='Tech Stack/Postgresql.png' className='team-logos-img' alt='Postgresql'/>
            <img src='Tech Stack/python.png' className='team-logos-img' alt='python'/>
            <img src='Tech Stack/r.png' className='team-logos-img' alt='r'/>
            <img src='Tech Stack/React.png' className='team-logos-img' alt='react'/>
            <img src='Tech Stack/rest.png' className='team-logos-img' alt='rest'/>
          </div>
        </section>
        
        <section className="features-section" id='features'>
        <h2 className='title-features'>Powerful Features</h2>
        <div className="feature-cards">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card ${feature.status}`}>
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>

            </div>
          ))}
        </div>
      </section>

        <section className="getting-started" id='works'>
          <h2 className='title-features'>How It Works</h2>
          <div className="step">
            <div>
              <h3>Radar Technology</h3>
              <p>Detects movement in real-time without relying on cameras. Can detect falls even in challenging conditions (e.g., in cluttered rooms or behind objects)</p>
            </div>
          </div>
          <div className="step">
            <div>
              <h3>Machine Learning model</h3>
              <p>The signals from the radar are sent over to our cloud architecture where our in house developed ML model processes the information.</p>
            </div>
          </div>
          <div className="step">
            <div>
              <h3>Alert System</h3>
              <p>Once a fall is detected, an alert is immediately sent to caregivers or emergency contacts via  notification.
              Customizable alert settings allow users to define specific emergency responses.</p>
            </div>
          </div>
        </section>
        
      </main>
        

      
    </div>
    <footer className="footer">
        <div className="footer-content">
          <img src="Fall_Guys_Logo.png" alt="Fall Logo" className="logo-footer" />
        </div>
        <div className="footer-bottom">
          <div className="footer-legal">
            <a href="#status">Status</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookie-preferences">Cookie Preferences</a>
            <a href="#contact-us">Contact Us</a>
          </div>
          <div className="footer-extra">
            <select name="language" id="language-select">
              <option value="en-us">English (US)</option>
              {/* Add more language options */}
            </select>
            <select name="region" id="region-select">
              <option value="us">United States</option>
              {/* Add more region options */}
            </select>
            <div className="social-links">
              {/* Add social media icons/links */}
            </div>
          </div>
          <p className="copyright">&copy;2024 Fall Guys Technologies, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;