import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2'; 
import { 
  FaArrowUp, FaArrowDown, FaMinus, FaStar, FaAward, 
  FaPlus, FaTrash, FaEllipsisV 
} from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'Fail': 0, 'RA': 0,
};

const Dashboard = ({ courses, semesters }) => {
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [hypotheticalSemesters, setHypotheticalSemesters] = useState([]);
  const [projectedSgpa, setProjectedSgpa] = useState('');
  const [projectedCredits, setProjectedCredits] = useState('');

  const allSemesters = [...semesters, ...hypotheticalSemesters];

  const lineData = {
    labels: allSemesters.map((sem, index) => `Sem ${index + 1}`),
    datasets: [
      {
        label: 'Actual SGPA',
        data: semesters.map(sem => sem.sgpa),
        borderColor: '#FF6600',
        backgroundColor: 'rgba(255, 102, 0, 0.2)',
        fill: true,
        tension: 0, 
      },
      {
        label: 'Projected SGPA',
        data: [
          ...Array(semesters.length - 1).fill(null),
          semesters.length > 0 ? semesters[semesters.length - 1].sgpa : null,
          ...hypotheticalSemesters.map(sem => sem.sgpa)
        ],
        borderColor: '#FF6600',
        backgroundColor: 'rgba(255, 102, 0, 0.2)',
        borderDash: [5, 5],
        fill: false,
        tension: 0,
      }
    ],
  };
  
  const gradeCounts = { 'O': 0, 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'Fail': 0 };
  courses.forEach(course => {
    if (gradeCounts.hasOwnProperty(course.grade)) {
      gradeCounts[course.grade]++;
    } else if (course.grade === 'RA') {
      gradeCounts['Fail']++;
    }
  });
  const barChartData = {
    labels: Object.keys(gradeCounts).filter(grade => gradeCounts[grade] > 0),
    datasets: [
      {
        label: 'Count of Each Grade',
        data: Object.values(gradeCounts).filter(count => count > 0),
        backgroundColor: [
          '#FF6600', '#FF8C00', '#FFA500', '#FFB74D', 
          '#FFCC80', '#FFD180', '#D32F2F'
        ],
        borderColor: '#1a1a1a',
        borderWidth: 2,
      },
    ],
  };

  let overallCgpa = 0;
  let gpaTrend = 'flat';
  
  if (allSemesters.length > 0) {
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    allSemesters.forEach(sem => {
      totalWeightedPoints += sem.sgpa * sem.credits;
      totalCredits += sem.credits;
    });
    overallCgpa = (totalWeightedPoints / totalCredits).toFixed(2);
    
    if (allSemesters.length > 1) {
      const firstGpa = allSemesters[0].sgpa;
      const lastGpa = allSemesters[allSemesters.length - 1].sgpa;
      if (lastGpa > firstGpa) gpaTrend = 'up';
      if (lastGpa < firstGpa) gpaTrend = 'down';
    }
  }

  let mostCommonGrade = 'N/A';
  if (courses.length > 0) {
    let maxCount = 0;
    for (const [grade, count] of Object.entries(gradeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonGrade = grade;
      }
    }
  }

  const addHypothetical = () => {
    const sgpa = parseFloat(projectedSgpa);
    const credits = Number(projectedCredits);
    if (isNaN(sgpa) || sgpa < 0 || sgpa > 10 || isNaN(credits) || credits <= 0) {
      return; 
    }
    setHypotheticalSemesters([...hypotheticalSemesters, { sgpa, credits }]);
    setProjectedSgpa('');
    setProjectedCredits('');
    setShowWhatIf(false); 
  };

  const clearHypothetical = () => {
    setHypotheticalSemesters([]);
    setShowWhatIf(false);
  };
  
  const lineChartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#c0c0c0', font: { size: 14 } } }, title: { display: false }, },
    scales: {
      x: { 
        ticks: { color: '#c0c0c0' }, 
        grid: { color: 'rgba(255, 102, 0, 0.1)' } 
      },
      y: { 
        ticks: { color: '#c0c0c0' }, 
        grid: { color: 'rgba(255, 102, 0, 0.1)' } 
      },
    },
  };
  
  const barChartOptions = {
    indexAxis: 'y', responsive: true,
    plugins: { legend: { display: false }, title: { display: false }, },
    scales: {
      x: { 
        ticks: { color: '#c0c0c0', stepSize: 1 }, 
        grid: { color: 'rgba(255, 102, 0, 0.1)' } 
      },
      y: { 
        ticks: { color: '#c0c0c0', font: { size: 14, weight: 'bold' } }, 
        grid: { display: false } 
      },
    },
  };

  const boxVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  };
  const neonGlow = { 
    scale: 1.05, 
    boxShadow: '0 0 15px #FF6600, 0 0 25px #FF6600' 
  };
  const redGlow = { 
    scale: 1.05, 
    boxShadow: '0 0 15px #ff6b6b' 
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="page-header">📊 Your Dashboard</h2>
      
      <motion.div 
        className="input-grid-target" // Re-using this class for a 3-col grid
        style={{marginBottom: '20px'}}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, staggerChildren: 0.1 }}
      >
        <motion.div 
          className="course-list-card" // Re-using this class for card style
          variants={boxVariants} 
          whileHover={{ scale: 1.03, boxShadow: '0 0 15px #FF6600' }}
        >
          <div className="input-label" style={{textAlign: 'center'}}><FaStar /> 
            {hypotheticalSemesters.length > 0 ? "Projected CGPA" : "Overall CGPA"}
          </div>
          <div className="gpa-display" style={{fontSize: '2.2em', color: '#FF6600', textAlign: 'center'}}> 
            {allSemesters.length > 0 ? overallCgpa : 'N/A'}
          </div>
        </motion.div>
        
        <motion.div 
          className="course-list-card"
          variants={boxVariants}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: gpaTrend === 'up' ? '0 0 15px #FF6600' : gpaTrend === 'down' ? '0 0 15px #ff6b6b' : '0 0 15px #ffffff' 
          }}
        >
          <div className="input-label" style={{textAlign: 'center'}}>
            {gpaTrend === 'up' && <FaArrowUp style={{color: '#FF6600'}}/>}
            {gpaTrend === 'down' && <FaArrowDown style={{color: '#ff6b6b'}}/>}
            {gpaTrend === 'flat' && <FaMinus />}
            {hypotheticalSemesters.length > 0 ? "Projected Trend" : "GPA Trend"}
          </div>
          <div className="gpa-display" style={{
            fontSize: '2.2em', 
            textAlign: 'center',
            color: gpaTrend === 'up' ? '#FF6600' : gpaTrend === 'down' ? '#ff6b6b' : '#ffffff'
          }}>
            {gpaTrend === 'up' ? 'Trending Up' : gpaTrend === 'down' ? 'Trending Down' : 'Steady'}
          </div>
        </motion.div>
        
        <motion.div 
          className="course-list-card" 
          variants={boxVariants} 
          whileHover={{ scale: 1.03, boxShadow: '0 0 15px #FF6600' }}
        >
          <div className="input-label" style={{textAlign: 'center'}}><FaAward /> Most Common Grade</div>
          <div className="gpa-display" style={{fontSize: '2.2em', color: '#FF6600', textAlign: 'center'}}>
            {mostCommonGrade}
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="course-list-card" // Re-using for style
        style={{position: 'relative'}} // For popup
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01, boxShadow: '0 0 15px #FF6600' }}
      >
        <h3 className="sub-header">📈 SGPA Trend (Over Time)</h3>
        
        <motion.button 
          className="what-if-toggle" // New class for 3-dot
          onClick={() => setShowWhatIf(!showWhatIf)}
          whileHover={{ color: '#FF6600', scale: 1.1 }}
        >
          <FaEllipsisV />
        </motion.button>
        
        {semesters.length > 0 || hypotheticalSemesters.length > 0 ? (
          <Line options={lineChartOptions} data={lineData} />
        ) : (
          <p className="placeholder-text">Add semesters in the "GPA Calculator" to see your trend.</p>
        )}

        <AnimatePresence>
          {showWhatIf && (
            <motion.div 
              className="what-if-card" // New class for popup
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="sub-header" style={{fontSize: '1.2em'}}>🔮 "What If?" Simulator</h3>
              <div className="what-if-input-grid">
                <div>
                  <div className="input-label">Projected SGPA</div>
                  <input 
                    type="number" 
                    className="input" 
                    style={{padding: '12px'}} // smaller
                    placeholder="e.g., 9.2"
                    value={projectedSgpa}
                    onChange={(e) => setProjectedSgpa(e.target.value)}
                  />
                </div>
                <div>
                  <div className="input-label">Semester Credits</div>
                  <input 
                    type="number" 
                    className="input" 
                    style={{padding: '12px'}} // smaller
                    placeholder="e.g., 21"
                    value={projectedCredits}
                    onChange={(e) => setProjectedCredits(e.target.value)}
                  />
                </div>
              </div>
              <div className="what-if-button-grid">
                <motion.button 
                  className="clear-button"
                  style={{padding: '12px'}} // bigger
                  onClick={clearHypothetical}
                  whileHover={redGlow}
                >
                  <FaTrash /> Clear
                </motion.button>
                <motion.button 
                  className="add-button"
                  style={{padding: '12px', marginTop: '0'}} // Overrides
                  onClick={addHypothetical}
                  whileHover={neonGlow}
                  whileTap={{scale: 0.95}}
                >
                  <FaPlus /> Add
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </motion.div>
      
      <motion.div 
        className="course-list-card"
        style={{marginTop: '20px'}}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.01, boxShadow: '0 0 15px #FF6600' }}
      >
        <h3 className="sub-header">📊 Grade Distribution (from SGPA)</h3>
        {courses.length > 0 ? (
          <div style={{maxHeight: '400px', display: 'flex', justifyContent: 'center'}}>
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        ) : (
          <p className="placeholder-text">Add courses in the "GPA Calculator" to see your grade breakdown.</p>
        )}
      </motion.div>
      
    </motion.div>
  );
};

export default Dashboard;