import React from 'react';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = ({ isConnected, onConnect }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="brand-name">DeMeRe</span>
      </div>
      <div className="navbar-menu">
        <ThemeToggle />
        <button 
          className={`connect-button ${isConnected ? 'connected' : ''}`}
          onClick={onConnect}
        >
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 