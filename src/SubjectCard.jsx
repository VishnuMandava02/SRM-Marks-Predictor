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

const SubjectCard = ({ subject, onDelete }) => {
  const [targetGrades, setTargetGrades] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

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

  return (
    <motion.div className="predictor-card" // Using new class
      style={{marginBottom: '20px'}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="card-header">
        <div className="card-title">{subject.name}</div>
        <motion.button 
          className="delete-button" 
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

      <div className="card-subtitle">
        <strong>Internal Marks:</strong> {subject.internal} / 60
      </div>

      <div className="predictor-layout">
        
        <div className="course-list-card" style={{padding: '20px'}}>
          <h4 className="sub-header" style={{fontSize: '1.2em'}}>🏁 Select Target Grade</h4>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Grade</th>
                <th className="th">Total (100)</th>
              </tr>
            </thead>
            <tbody>
              {targetGrades.map((item) => (
                <tr key={item.grade}>
                  <td className="td" style={{padding: '5px'}}>
                    <motion.button
                      className={selectedGrade === item.grade ? "grade-button-active" : "grade-button"}
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
                  <td className="td">{item.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="result-box">
          <h4 className="sub-header" style={{fontSize: '1.2em'}}><FaBullseye /> Marks Needed (out of 75)</h4>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedResult} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {!selectedResult && (
                <p className="result-text" style={{color: '#c0c0c0', fontSize: '1.2em'}}>
                  Click a grade on the left.
                </p>
              )}
              
              {selectedResult && (
                <p className="result-text" style={{
                  color: selectedResult.startsWith('Guaranteed') ? '#69f0ae' : 
                         selectedResult.startsWith('Impossible') ? '#ff6b6b' : 
                         selectedResult.startsWith('You will fail') ? '#ff9e80' : '#ffffff'
                }}>
                  {selectedResult.startsWith('Guaranteed') && <FaCheckCircle className="result-icon" />}
                  {selectedResult.startsWith('Impossible') && <FaTimesCircle className="result-icon" />}
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