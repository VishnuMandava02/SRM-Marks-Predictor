import React from 'react';
import { motion } from 'framer-motion';

const Resources = () => {

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="page-header">📚 Grading Policy Guide</h2>
      
      <div className="info-grid">
        
        <motion.div 
          className="info-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{scale: 1.02, boxShadow: "0 0 15px rgba(255, 102, 0, 0.5)"}}
        >
          <h3 className="sub-header">Final Marks to Grade</h3>
          <p style={{color: '#c0c0c0', marginTop: 0}}>This table shows the final percentage needed (Internal + External) to get each grade.</p>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Mark Range (out of 100)</th>
                <th className="th">Grade</th>
              </tr>
            </thead>
            <tbody>
              {marksToGradeData.map((item) => (
                <tr key={item.grade}>
                  <td className="td">{item.range}</td>
                  <td className="td-grade">{item.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div 
          className="info-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{scale: 1.02, boxShadow: "0 0 15px rgba(255, 102, 0, 0.5)"}}
        >
          <h3 className="sub-header">Grade to Points (for GPA)</h3>
          <p style={{color: '#c0c0c0', marginTop: 0}}>This table shows the points used to calculate your SGPA and CGPA for each grade.</p>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Grade</th>
                <th className="th">Points</th>
                <th className="th">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {gradeToPointData.map((item) => (
                <tr key={item.grade}>
                  <td className="td-grade">{item.grade}</td>
                  <td className="td">{item.points}</td>
                  <td className="td">{item.meaning}</td>
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