import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBullseye, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTrash 
} from 'react-icons/fa';

// --- Grading Formula & Logic ---
const GRADE_MIN_MARKS = [
  { grade: 'O', min: 91, max: 100 },
  { grade: 'A+', min: 81, max: 90 },
  { grade: 'A', min: 71, max: 80 },
  { grade: 'B+', min: 61, max: 70 },
  { grade: 'B', min: 55, max: 60 },
  { grade: 'C', min: 51, max: 54 },
  { grade: 'Pass', min: 50, max: 50 },
];
const convertExternalTo40 = (externalMarks) => { return (externalMarks / 75) * 40; };
const getGrade = (totalMarks) => {
  for (const item of GRADE_MIN_MARKS) { if (totalMarks >= item.min) return item.grade; }
  return 'Fail';
};
const calculateExternalNeeded = (internal, targetTotal) => {
  const needed_for_40 = targetTotal - internal;
  if (needed_for_40 <= 0) return 0;
  return (needed_for_40 / 40) * 75;
};

// --- The Subject Card Component ---
const SubjectCard = ({ subject, onDelete }) => {
  const [targetGrades, setTargetGrades] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  // --- Calculate Target Grade RANGES on load ---
  useEffect(() => {
    const internal = subject.internal;
    const neededMarks = [];
    let minMarkForGradeAbove = 76; 

    for (const item of GRADE_MIN_MARKS) {
      const { grade, min, max } = item;
      const minNeededForThisGrade = Math.ceil(calculateExternalNeeded(internal, min));
      let neededText = "";
      
      if (minNeededForThisGrade > 75) {
        neededText = "Impossible";
      } else if (minNeededForThisGrade < 0) {
         const maxPossibleTotal = internal + convertExternalTo40(75);
         neededText = `Guaranteed ${getGrade(maxPossibleTotal)}!`;
      } else {
        const maxNeededForThisGrade = (minMarkForGradeAbove > 75) ? 75 : minMarkForGradeAbove - 1;
        
        if (minNeededForThisGrade > maxNeededForThisGrade) {
           const maxPossibleTotal = internal + convertExternalTo40(75);
           neededText = `Guaranteed ${getGrade(maxPossibleTotal)}!`;
        } else {
          neededText = `You need ${minNeededForThisGrade} – ${maxNeededForThisGrade} marks.`;
        }
      }
      if (grade === 'O' && minNeededForThisGrade <= 75) {
        neededText = `You need ${minNeededForThisGrade < 0 ? 0 : minNeededForThisGrade} – 75 marks.`;
      }
      neededMarks.push({ ...item, needed: neededText });
      minMarkForGradeAbove = minNeededForThisGrade;
    }
    const minPassNeeded = Math.ceil(calculateExternalNeeded(internal, 50));
    neededMarks.push({
      grade: 'Fail', range: '< 50',
      needed: minPassNeeded <= 0 ? "Impossible to Fail" : `You will fail with ${minPassNeeded - 1} marks or less.`,
    });
    setTargetGrades(neededMarks.filter(item => item.grade !== 'Pass')); 
  }, [subject.internal]);

  const handleGradeClick = (grade, neededText) => {
    setSelectedGrade(grade);
    setSelectedResult(neededText);
  };

  // --- Styles ---
  const styles = {
    card: {
      padding: '20px', backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)', borderRadius: '10px',
      border: '1px solid rgba(255, 102, 0, 0.2)', marginBottom: '20px',
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '1px solid #FF6600', paddingBottom: '10px', marginBottom: '15px',
    },
    subjectName: { fontSize: '1.5em', color: '#FF6600', fontWeight: 'bold' },
    internalInfo: { fontSize: '1.1em', color: '#c0c0c0', marginBottom: '20px' },
    deleteButton: {
      background: 'none', border: 'none', color: '#ff6b6b',
      cursor: 'pointer', fontSize: '1.2em',
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr', 
      gap: '20px',
    },
    tableCard: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '8px', padding: '20px',
    },
    subHeader: {
      fontSize: '1.2em', color: '#FF6600',
      marginBottom: '10px', display: 'flex',
      alignItems: 'center', gap: '10px',
    },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: {
      borderBottom: '2px solid #FF6600', padding: '10px',
      textAlign: 'left', color: '#ffffff', fontSize: '0.9em',
    },
    td: { borderBottom: '1px solid #2E1A00', padding: '8px', fontSize: '0.9em' },
    gradeButton: {
      width: '100%',
      padding: '10px',
      fontSize: '1em',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      backgroundColor: 'rgba(255, 102, 0, 0.1)',
      color: '#FF6600',
      transition: 'all 0.2s ease',
    },
    gradeButtonActive: {
      width: '100%',
      padding: '10px',
      fontSize: '1em',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      backgroundColor: '#FF6600',
      color: '#000000',
      boxShadow: '0 0 15px #FF6600',
    },
    resultBox: {
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    resultText: {
      fontSize: '1.5em',
      fontWeight: 'bold',
      color: '#ffffff',
      margin: '0',
    },
    resultIcon: {
      marginRight: '10px',
    }
  };

  return (
    <motion.div style={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div style={styles.header}>
        <div style={styles.subjectName}>{subject.name}</div>
        <motion.button 
          style={styles.deleteButton} 
          onClick={() => onDelete(subject.id)}
          whileHover={{ 
            scale: 1.2, 
            color: '#ff0000', 
            textShadow: '0 0 10px #ff6b6b' 
          }}
        >
          <FaTrash />
        </motion.button>
      </div>

      <div style={styles.internalInfo}>
        <strong>Internal Marks:</strong> {subject.internal} / 60
      </div>

      <div style={styles.contentGrid}>
        
        <div style={styles.tableCard}>
          <h4 style={styles.subHeader}>🏁 Select Target Grade</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Grade</th>
                <th style={styles.th}>Total (100)</th>
              </tr>
            </thead>
            <tbody>
              {targetGrades.map((item) => (
                <tr key={item.grade}>
                  <td style={{...styles.td, padding: '5px'}}>
                    <motion.button
                      style={selectedGrade === item.grade ? styles.gradeButtonActive : styles.gradeButton}
                      onClick={() => handleGradeClick(item.grade, item.needed)}
                      whileHover={selectedGrade !== item.grade ? { 
                        backgroundColor: 'rgba(255, 102, 0, 0.3)',
                        boxShadow: '0 0 10px #FF6600'
                      } : {}}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.grade}
                    </motion.button>
                  </td>
                  <td style={styles.td}>{item.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.resultBox}>
          <h4 style={styles.subHeader}><FaBullseye /> Marks Needed (out of 75)</h4>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedResult} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {!selectedResult && (
                <p style={{...styles.resultText, color: '#c0c0c0', fontSize: '1.2em'}}>
                  Click a grade on the left.
                </p>
              )}
              
              {selectedResult && (
                <p style={{
                  ...styles.resultText,
                  color: selectedResult.startsWith('Guaranteed') ? '#69f0ae' : 
                         selectedResult.startsWith('Impossible') ? '#ff6b6b' : 
                         selectedResult.startsWith('You will fail') ? '#ff9e80' : '#ffffff'
                }}>
                  {selectedResult.startsWith('Guaranteed') && <FaCheckCircle style={styles.resultIcon} />}
                  {selectedResult.startsWith('Impossible') && <FaTimesCircle style={styles.resultIcon} />}
                  {selectedResult}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
    </motion.div>
  );
};

export default SubjectCard;