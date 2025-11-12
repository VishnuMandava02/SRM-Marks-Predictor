import React from 'react';
import { motion } from 'framer-motion';

// This component is simple. It just displays information.
const Resources = () => {

  // Data for the tables
  const gradeToPointData = [
    { grade: 'O', points: 10, meaning: 'Outstanding' },
    { grade: 'A+', points: 9, meaning: 'Excellent' },
    { grade: 'A', points: 8, meaning: 'Very Good' },
    { grade: 'B+', points: 7, meaning: 'Good' },
    { grade: 'B', points: 6, meaning: 'Above Average' },
    { grade: 'C', points: 5, meaning: 'Average' },
    { grade: 'RA', points: 0, meaning: 'Re-Attempt' },
    { grade: 'Fail', points: 0, meaning: 'Fail' },
  ];

  const marksToGradeData = [
    { range: '91% – 100%', grade: 'O' },
    { range: '81% – 90%', grade: 'A+' },
    { range: '71% – 80%', grade: 'A' },
    { range: '61% – 70%', grade: 'B+' },
    { range: '55% – 60%', grade: 'B' },
    { range: '51% – 54%', grade: 'C' },
    { range: '50%', grade: 'Pass' },
    { range: '< 50%', grade: 'Fail / RA' },
  ];

  // Styles using the Black & Orange theme
  const styles = {
    header: {
      fontSize: '2.5em', fontWeight: 'bold', color: '#ffffff',
      marginBottom: '30px', borderBottom: '2px solid #FF6600',
      paddingBottom: '10px', textShadow: '0 0 5px #FF6600',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    infoCard: {
      padding: '25px', backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)', borderRadius: '10px',
      border: '1px solid rgba(255, 102, 0, 0.2)',
    },
    subHeader: {
      fontSize: '1.5em', color: '#FF6600', marginBottom: '15px',
      borderBottom: '1px solid rgba(255, 102, 0, 0.3)', paddingBottom: '10px',
    },
    table: { 
      width: '100%', 
      borderCollapse: 'collapse', 
      marginTop: '10px' 
    },
    th: {
      borderBottom: '2px solid #FF6600', padding: '12px',
      textAlign: 'left', color: '#ffffff',
    },
    td: { 
      borderBottom: '1px solid #2E1A00', 
      padding: '12px',
      color: '#c0c0c0',
    },
    tdGrade: {
      borderBottom: '1px solid #2E1A00', 
      padding: '12px',
      color: '#FF8C00', // Brighter orange for the grade
      fontWeight: 'bold',
      fontSize: '1.1em',
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={styles.header}>📚 Resources & Grading Policy</h2>
      
      <div style={styles.grid}>
        
        {/* --- Card 1: Marks to Grade --- */}
        <motion.div 
          style={styles.infoCard}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{scale: 1.02, boxShadow: "0 0 15px rgba(255, 102, 0, 0.5)"}}
        >
          <h3 style={styles.subHeader}>Final Marks to Grade</h3>
          <p style={{color: '#c0c0c0', marginTop: 0}}>This table shows the final percentage needed (Internal + External) to get each grade.</p>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Mark Range (out of 100)</th>
                <th style={styles.th}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {marksToGradeData.map((item) => (
                <tr key={item.grade}>
                  <td style={styles.td}>{item.range}</td>
                  <td style={styles.tdGrade}>{item.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* --- Card 2: Grade to Points --- */}
        <motion.div 
          style={styles.infoCard}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{scale: 1.02, boxShadow: "0 0 15px rgba(255, 102, 0, 0.5)"}}
        >
          <h3 style={styles.subHeader}>Grade to Points (for GPA)</h3>
          <p style={{color: '#c0c0c0', marginTop: 0}}>This table shows the points used to calculate your SGPA and CGPA for each grade.</p>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Grade</th>
                <th style={styles.th}>Points</th>
                <th style={styles.th}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {gradeToPointData.map((item) => (
                <tr key={item.grade}>
                  <td style={styles.tdGrade}>{item.grade}</td>
                  <td style={styles.td}>{item.points}</td>
                  <td style={styles.td}>{item.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Resources;