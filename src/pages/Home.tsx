import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-title">
            Welcome to <span className="brand-name"></span>
          </h1>
          <p className="home-subtitle">
            Your smart shopping companion for organized and stress-free shopping
          </p>
          <p className="home-description">
            Create, manage, and organize your shopping lists with ease. 
            Never forget an item again!
          </p>
          <button 
            className="get-started-btn"
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </div>
        
        <div className="home-features">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Easy List Creation</h3>
            <p>Create and organize multiple shopping lists effortlessly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Quickly find items with our powerful search feature</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track & Organize</h3>
            <p>Categorize items and track your shopping progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
