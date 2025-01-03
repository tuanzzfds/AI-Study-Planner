import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaGraduationCap,
  FaCalendar,
  FaListAlt,
  FaCogs,
  FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../styles/theme.css';

const Sidebar = ({ activeTab }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.body.className = newTheme ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/users/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const navLinks = [
    { to: '/dashboard', icon: <FaListAlt />, label: 'Dashboard' },
    { to: '/calendar', icon: <FaCalendar />, label: 'Calendar' },
    { to: '/taskpage', icon: <FaListAlt />, label: 'Task' },
    { to: '/profile', icon: <FaGraduationCap />, label: 'Profile' },
    { to: '/settings', icon: <FaCogs />, label: 'Settings' },
  ];

  return (
    <div className={`sidebar d-flex flex-column ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="logo d-flex align-items-center p-3">
        <FaGraduationCap size={24} />
        <span className="ms-2">MyStudyLife</span>
      </div>
      <nav className="flex-grow-1">
        {navLinks.map((link, index) => (
          <OverlayTrigger
            key={index}
            placement="right"
            overlay={<Tooltip id={`tooltip-${link.label.toLowerCase()}`}>{link.label}</Tooltip>}
          >
            <Link to={link.to} className="nav-link">
              {link.icon}
              <span className="ms-2">{link.label}</span>
            </Link>
          </OverlayTrigger>
        ))}
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id={`tooltip-logout`}>Logout</Tooltip>}
        >
          <button className="btn btn-link nav-link" onClick={handleLogout}>
            <FaSignOutAlt />
            <span className="ms-2">Logout</span>
          </button>
        </OverlayTrigger>
      </nav>
      <div className="bottom-section p-3">
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="tooltip-add-task">Add new task</Tooltip>}
        >
          <Link to="/new-task" className="btn btn-primary w-100 mb-2">
            + Add new task
          </Link>
        </OverlayTrigger>
        <div className="theme-switch d-flex align-items-center justify-content-between">
          <span>Theme</span>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="themeSwitch"
              checked={isDarkTheme}
              onChange={toggleTheme}
            />
            <label className="form-check-label" htmlFor="themeSwitch">
              {isDarkTheme ? 'Dark' : 'Light'}
            </label>
          </div>
        </div>
      </div>
      {/* Removed toggle button */}
    </div>
  );
};

export default Sidebar;