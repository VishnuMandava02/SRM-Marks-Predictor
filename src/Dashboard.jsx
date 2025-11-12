import React from 'react';
import { motion } from 'framer-motion';
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
import { FaArrowUp, FaArrowDown, FaMinus, FaStar, FaAward } from 'react-icons/fa';

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

  // --- Data processing (unchanged) ---
  const lineData = {
    labels: semesters.map((sem, index) => `Sem ${index + 1}`),
    datasets: [
      {
        label: 'SGPA Trend',
        data: semesters.map(sem => sem.sgpa),
        borderColor: '#FF6600',
        backgroundColor: 'rgba(255, 102, 0, 0.2)',
        fill: true,
        tension: 0, 
      },
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
  let totalCredits = 0;
  let gpaTrend = 'flat';
  if (semesters.length > 0) {
    let totalWeightedPoints = 0;
    semesters.forEach(sem => {
      totalWeightedPoints += sem.sgpa * sem.credits;
      totalCredits += sem.credits;
    });
    overallCgpa = (totalWeightedPoints / totalCredits).toFixed(2);
    if (semesters.length > 1) {
      const firstGpa = semesters[0].sgpa;
      const lastGpa = semesters[semesters.length - 1].sgpa;
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
  
  const styles = {
    header: {
      fontSize: '2.5em', fontWeight: 'bold', color: '#ffffff',
      marginBottom: '30px', borderBottom: '2px solid #FF6600',
      paddingBottom: '10px', textShadow: '0 0 5px #FF6600',
    },
    insightGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '20px',
    },
    insightCard: {
      backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 102, 0, 0.2)',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
    },
    insightLabel: {
      fontSize: '1em',
      color: '#c0c0c0',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    insightValue: {
      fontSize: '2.2em',
      fontWeight: 'bold',
      color: '#ffffff',
    },
    chartCard: {
      padding: '25px', backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)', borderRadius: '10px',
      border: '1px solid rgba(255, 102, 0, 0.2)',
      transition: 'all 0.3s ease',
    },
    subHeader: {
      fontSize: '1.5em', color: '#FF6600', marginBottom: '15px',
    },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={styles.header}>📊 Your Dashboard</h2>
      
      <motion.div 
        style={styles.insightGrid}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, staggerChildren: 0.1 }}
      >
        <motion.div 
          style={styles.insightCard} 
          variants={boxVariants} 
          whileHover={{ scale: 1.03, boxShadow: '0 0 15px #FF6600' }} // <<< --- Orange Glow
        >
          <div style={styles.insightLabel}><FaStar /> Overall CGPA</div>
          {/* --- COLOR FIXED --- */}
          <div style={{...styles.insightValue, color: '#FF6600'}}> 
            {semesters.length > 0 ? overallCgpa : 'N/A'}
          </div>
        </motion.div>
        
        <motion.div 
          style={styles.insightCard} 
          variants={boxVariants}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: gpaTrend === 'up' ? '0 0 15px #FF6600' : gpaTrend === 'down' ? '0 0 15px #ff6b6b' : '0 0 15px #ffffff' 
          }}
        >
          <div style={styles.insightLabel}>
            {/* --- COLOR FIXED --- */}
            {gpaTrend === 'up' && <FaArrowUp style={{color: '#FF6600'}}/>}
            {gpaTrend === 'down' && <FaArrowDown style={{color: '#ff6b6b'}}/>}
            {gpaTrend === 'flat' && <FaMinus />}
            GPA Trend
          </div>
          <div style={{
            ...styles.insightValue,
            // --- COLOR FIXED ---
            color: gpaTrend === 'up' ? '#FF6600' : gpaTrend === 'down' ? '#ff6b6b' : '#ffffff'
          }}>
            {gpaTrend === 'up' ? 'Trending Up' : gpaTrend === 'down' ? 'Trending Down' : 'Steady'}
          </div>
        </motion.div>
        
        <motion.div 
          style={styles.insightCard} 
          variants={boxVariants} 
          whileHover={{ scale: 1.03, boxShadow: '0 0 15px #FF6600' }}
        >
          <div style={styles.insightLabel}><FaAward /> Most Common Grade</div>
          <div style={{...styles.insightValue, color: '#FF6600'}}>
            {mostCommonGrade}
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        style={styles.chartCard}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01, boxShadow: '0 0 15px #FF6600' }}
      >
        <h3 style={styles.subHeader}>📈 SGPA Trend (Over Time)</h3>
        {semesters.length > 0 ? (
          <Line options={lineChartOptions} data={lineData} />
        ) : (
          <p style={{color: '#c0c0c0'}}>Add semesters in the "GPA Calculator" to see your trend.</p>
        )}
      </motion.div>
      
      <motion.div 
        style={{...styles.chartCard, marginTop: '20px'}}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.01, boxShadow: '0 0 15px #FF6600' }}
      >
        <h3 style={styles.subHeader}>📊 Grade Distribution (from SGPA)</h3>
        {courses.length > 0 ? (
          <div style={{maxHeight: '400px', display: 'flex', justifyContent: 'center'}}>
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        ) : (
          <p style={{color: '#c0c0c0'}}>Add courses in the "GPA Calculator" to see your grade breakdown.</p>
        )}
      </motion.div>
      
    </motion.div>
  );
};

const boxVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 }
};

export default Dashboard;