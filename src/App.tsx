import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LeftNavigation from './components/LeftNavigation';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <LeftNavigation />
        <Routes>
          {/* Your routes here */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 