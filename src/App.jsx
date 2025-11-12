import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { 
  FaGraduationCap, 
  FaCalculator, 
  FaChartBar, 
  FaBook,
  FaChartPie
} from 'react-icons/fa';

import GradePredictor from './GradePredictor'; 
import GpaCalculator from './GpaCalculator';   
import Dashboard from './Dashboard'; 
// We no longer import AiHeader
import Resources from './Resources';
import './App.css'; 

function App() {
  const [activePage, setActivePage] = useState('dashboard'); 
  
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('srmhub.courses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [semesters, setSemesters] = useState(() => {
    const saved = localStorage.getItem('srmhub.semesters');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('srmhub.courses', JSON.stringify(courses));
  }, [courses]);

  React.useEffect(() => {
    localStorage.setItem('srmhub.semesters', JSON.stringify(semesters));
  }, [semesters]);

  // --- "Live AI Mood" Background (Black/Orange/Red) ---
  useEffect(() => {
    let cgpa = 0;
    if (semesters.length > 0) {
      let totalWeightedPoints = 0;
      let totalCredits = 0;
      semesters.forEach(sem => {
        totalWeightedPoints += sem.sgpa * sem.credits;
        totalCredits += sem.credits;
      });
      if (totalCredits > 0) {
        cgpa = (totalWeightedPoints / totalCredits);
      }
    }

    const root = document.documentElement;
    
    if (cgpa >= 9.0) {
      // Excellent (Black & Bright Orange/Gold)
      root.style.setProperty('--color1', '#000000');
      root.style.setProperty('--color2', '#1a1a1a');
      root.style.setProperty('--color3', '#FF8C00');
      root.style.setProperty('--color4', '#000000');
    } else if (cgpa < 8.0 && cgpa > 0) {
      // Warning (Black & Red)
      root.style.setProperty('--color1', '#000000');
      root.style.setProperty('--color2', '#1a1a1a');
      root.style.setProperty('--color3', '#D32F2F');
      root.style.setProperty('--color4', '#000000');
    } else {
      // Default (Black & Dark Orange)
      root.style.setProperty('--color1', '#000000');
      root.style.setProperty('--color2', '#1a1a1a');
      root.style.setProperty('--color3', '#2E1A00');
      root.style.setProperty('--color4', '#000000');
    }
  }, [semesters]); 
  // --- End of feature ---

  // --- Glitter Hover for Sidebar (Orange) ---
  const sidebarHover = {
    scale: 1.05,
    backgroundColor: "rgba(255, 102, 0, 0.1)",
    color: "#ffffff",
    boxShadow: "0 0 15px rgba(255, 102, 0, 0.5)",
    originX: 0 
  };

  return (
    // Reverted to the simple ".App" layout
    <div className="App">
      
      {/* --- Sidebar --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <FaGraduationCap size={30} />
          <span>🎓 SRM-HUB</span>
        </div>
        <nav className="nav-menu">
          
          <motion.a 
            href="#" 
            className={activePage === 'dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage('dashboard')} 
            whileHover={sidebarHover} 
          >
            <FaChartPie />
            📊 Dashboard
          </motion.a>

          <motion.a 
            href="#" 
            className={activePage === 'predictor' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage('predictor')} 
            whileHover={sidebarHover} 
          >
            <FaCalculator />
            🎯 Grade Predictor
          </motion.a>
          
          <motion.a 
            href="#" 
            className={activePage === 'gpa' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage('gpa')} 
            whileHover={sidebarHover} 
          >
            <FaChartBar />
            🧮 GPA Calculator
          </motion.a>

          <motion.a 
            href="#" 
            className={activePage === 'resources' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage('resources')}
            whileHover={sidebarHover} 
          >
            <FaBook />
            📚 Resources
          </motion.a>
        </nav>
      </aside>
      
      {/* --- Main Content --- */}
      <main className="main-content">
        
        {activePage === 'dashboard' && (
          <Dashboard courses={courses} semesters={semesters} />
        )}
        
        {activePage === 'predictor' && <GradePredictor />}
        
        {activePage === 'gpa' && (
          <GpaCalculator 
            courses={courses} 
            setCourses={setCourses} 
            semesters={semesters} 
            setSemesters={setSemesters} 
          />
        )}

        {activePage === 'resources' && <Resources />}
          
      </main>

    </div>
  );
}

export default App;