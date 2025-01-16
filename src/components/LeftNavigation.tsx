import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext'; // Assuming you have a ThemeContext

function LeftNavigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/clients">Clients</Link>
        </li>
        {/* Add the theme toggle here */}
        <li>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default LeftNavigation; 