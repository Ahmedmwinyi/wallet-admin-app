import React, { useContext, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { SidebarContext } from '../../context/SidebarContext';
import { LIGHT_THEME } from '../../constants/themeConstants';
import LogoBlue from '../../assets/images/logo_blue.svg';
import LogoWhite from '../../assets/images/logo_white.svg';
import { MdOutlineClose, MdOutlineGridView, MdOutlinePeople, MdOutlineCurrencyExchange, MdOutlineBarChart, MdOutlineReport, MdOutlineMessage, MdOutlineSettings, MdOutlineLogout } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const key = localStorage.getItem('key');
    console.log('Key from localStorage:', key);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  }, [closeSidebar]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleLogout = async () => {
    const key = localStorage.getItem('key');
    if (!key) {
      console.error('No key found in localStorage');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8088/admin/logout?key=${key}`);
      if (response.status === 200) {
        localStorage.clear();
        navigate('/');
      } else {
        console.error('Logout failed:', response);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`} ref={navbarRef}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="Logo" />
          <span className="sidebar-brand-text">Wallet</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/dashboard" className="menu-link active">
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/customer" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Customers</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/transactions" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={18} />
                </span>
                <span className="menu-link-text">Transactions</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/statistics" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={20} />
                </span>
                <span className="menu-link-text">Statistics</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/report" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineReport size={18} />
                </span>
                <span className="menu-link-text">Report</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/messages" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineMessage size={18} />
                </span>
                <span className="menu-link-text">Messages</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/settings" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </Link>
            </li>
            <li className="menu-item">
              <button className="menu-link" onClick={handleLogout}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
