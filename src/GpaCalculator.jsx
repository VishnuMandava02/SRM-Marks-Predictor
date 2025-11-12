import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaTrash, FaCalculator, FaStar, FaListAlt, FaBook, FaLayerGroup,
  FaCrosshairs, FaBullseye, FaLock, FaLockOpen
} from 'react-icons/fa';

const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'RA': 0, 'Fail': 0,
};

const getGradeFromPoints = (points) => {
  if (points >= 9.5) return 'O';
  if (points >= 8.5) return 'A+';
  if (points >= 7.5) return 'A';
  if (points >= 6.5) return 'B+';
  if (points >= 5.5) return 'B';
  if (points >= 5.0) return 'C';
  return 'Fail';
};

const GpaCalculator = ({ courses, setCourses, semesters, setSemesters }) => {
  const [mode, setMode] = useState('sgpa'); 
  const [currentGrade, setCurrentGrade] = useState('O');
  const [currentCredits, setCurrentCredits] = useState('');
  const [finalSgpa, setFinalSgpa] = useState(null);
  const [currentSemesterGpa, setCurrentSemesterGpa] = useState('');
  const [currentSemesterCredits, setCurrentSemesterCredits] = useState('');
  const [finalCgpa, setFinalCgpa] = useState(null);
  const [targetCgpa, setTargetCgpa] = useState('');
  const [currentSemCreditsForCgpa, setCurrentSemCreditsForCgpa] = useState('');
  const [requiredSgpa, setRequiredSgpa] = useState(null);
  const [sgpaTargetCourses, setSgpaTargetCourses] = useState([]);
  const [sgpaTargetGoal, setSgpaTargetGoal] = useState('');
  const [sgpaTargetResult, setSgpaTargetResult] = useState(null);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState('');
  const [error, setError] = useState(null);

  // --- All calculation logic (unchanged) ---
  const addCourse = () => {
    setError(null);
    const credits = Number(currentCredits);
    if (isNaN(credits) || credits <= 0 || credits > 10) {
      setError('Please enter valid course credits (e.g., 3 or 4).'); return;
    }
    const newCourse = { id: Date.now(), grade: currentGrade, credits: credits };
    setCourses([...courses, newCourse]); 
    setCurrentGrade('O'); setCurrentCredits(''); setFinalSgpa(null);
  };
  const calculateSgpa = () => {
    setError(null);
    if (courses.length === 0) {
      setError('Please add at least one course for SGPA.'); return;
    }
    let totalPoints = 0; let totalCredits = 0;
    courses.forEach(course => {
      totalPoints += GRADE_POINTS[course.grade] * course.credits;
      totalCredits += course.credits;
    });
    setFinalSgpa((totalPoints / totalCredits).toFixed(2));
  };
  const clearSgpa = () => {
    setCourses([]); setFinalSgpa(null); setError(null); setCurrentCredits(''); 
  };
  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id)); 
    setFinalSgpa(null);
  };
  const addSemester = () => {
    setError(null);
    const sgpa = parseFloat(currentSemesterGpa);
    const credits = Number(currentSemesterCredits);
    if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) {
      setError('Please enter a valid SGPA (0-10).'); return;
    }
    if (isNaN(credits) || credits <= 0 || credits > 50) {
      setError('Please enter valid total semester credits (e.g., 21).'); return;
    }
    const newSemester = { id: Date.now(), sgpa: sgpa, credits: credits };
    setSemesters([...semesters, newSemester]); 
    setCurrentSemesterGpa(''); setCurrentSemesterCredits(''); setFinalCgpa(null);
  };
  const calculateCgpa = () => {
    setError(null);
    if (semesters.length === 0) {
      setError('Please add at least one semester for CGPA.'); return;
    }
    let totalWeightedPoints = 0; let totalCredits = 0;
    semesters.forEach(sem => {
      totalWeightedPoints += sem.sgpa * sem.credits;
      totalCredits += sem.credits;
    });
    setFinalCgpa((totalWeightedPoints / totalCredits).toFixed(2));
  };
  const clearCgpa = () => {
    setSemesters([]); setFinalCgpa(null); setError(null); 
    setCurrentSemesterGpa(''); setCurrentSemesterCredits('');
  };
  const deleteSemester = (id) => {
    setSemesters(semesters.filter(sem => sem.id !== id)); 
    setFinalCgpa(null);
  };
  const calculateRequiredSgpa = () => {
    setError(null); setRequiredSgpa(null);
    const dreamCgpa = parseFloat(targetCgpa);
    const currentCredits = Number(currentSemCreditsForCgpa);
    if (isNaN(dreamCgpa) || dreamCgpa <= 0 || dreamCgpa > 10) {
      setError('Please enter a valid "Dream CGPA" (e.g., 9.0).'); return;
    }
    if (isNaN(currentCredits) || currentCredits <= 0 || currentCredits > 50) {
      setError('Please enter valid credits for this semester (e.g., 21).'); return;
    }
    let pastWeightedPoints = 0; let pastCredits = 0;
    semesters.forEach(sem => {
      pastWeightedPoints += sem.sgpa * sem.credits;
      pastCredits += sem.credits;
    });
    const totalCredits = pastCredits + currentCredits;
    const totalWeightedPointsNeeded = dreamCgpa * totalCredits;
    const pointsNeededThisSem = totalWeightedPointsNeeded - pastWeightedPoints;
    const requiredSgpaResult = pointsNeededThisSem / currentCredits;
    setRequiredSgpa(requiredSgpaResult.toFixed(2));
  };
  const addSgpaTargetCourse = () => {
    setError(null);
    const credits = Number(newCourseCredits);
    if (!newCourseName.trim()) {
      setError("Please enter a course name."); return;
    }
    if (isNaN(credits) || credits <= 0 || credits > 10) {
      setError("Please enter valid credits (e.g., 4)."); return;
    }
    const newCourse = {
      id: Date.now(),
      name: newCourseName,
      credits: credits,
      grade: 'O', 
      isLocked: false,
    };
    setSgpaTargetCourses([...sgpaTargetCourses, newCourse]);
    setNewCourseName('');
    setNewCourseCredits('');
    setSgpaTargetResult(null);
  };
  const deleteSgpaTargetCourse = (id) => {
    setSgpaTargetCourses(sgpaTargetCourses.filter(c => c.id !== id));
    setSgpaTargetResult(null);
  };
  const updateSgpaTargetCourse = (id, field, value) => {
    setSgpaTargetCourses(sgpaTargetCourses.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
    setSgpaTargetResult(null);
  };
  const calculateSgpaTarget = () => {
    setError(null);
    const target = parseFloat(sgpaTargetGoal);
    if (isNaN(target) || target <= 0 || target > 10) {
      setError("Please enter a valid Target SGPA (e.g., 9.0)."); return;
    }
    if (sgpaTargetCourses.length === 0) {
      setError("Please add at least one course."); return;
    }
    let totalCredits = 0, lockedCredits = 0, lockedPoints = 0;
    sgpaTargetCourses.forEach(c => {
      totalCredits += c.credits;
      if (c.isLocked) {
        lockedCredits += c.credits;
        lockedPoints += GRADE_POINTS[c.grade] * c.credits;
      }
    });
    const unlockedCredits = totalCredits - lockedCredits;
    if (unlockedCredits <= 0) {
      setError("You've locked all courses! Calculate in SGPA mode.");
      setSgpaTargetResult(null);
      return;
    }
    const totalPointsNeeded = target * totalCredits;
    const pointsNeededFromUnlocked = totalPointsNeeded - lockedPoints;
    const requiredAvgPoint = pointsNeededFromUnlocked / unlockedCredits;
    setSgpaTargetResult({
      avgPoint: requiredAvgPoint.toFixed(2),
      avgGrade: getGradeFromPoints(requiredAvgPoint),
    });
  };
  const clearSgpaTarget = () => {
    setSgpaTargetCourses([]);
    setSgpaTargetGoal('');
    setSgpaTargetResult(null);
    setError(null);
  };
  
  // --- Complements Functions (Colors Updated) ---
  const getGpaMessage = (gpa) => {
    const numGpa = Number(gpa);
    if (numGpa >= 9.0) return { message: "🎉 Outstanding! Well done!", color: "#FF6600" }; // Orange
    if (numGpa >= 8.0) return { message: "🥳 Excellent! Keep doing well!", color: "#FFA500" }; // Lighter Orange
    if (numGpa >= 7.0) return { message: "👍 Good work! Keep pushing!", color: "#ffffff" };
    if (numGpa >= 6.0) return { message: "💪 Solid effort. Aim higher!", color: "#ff9e80" }; // Red-Orange
    return { message: "📈 You passed. Let's improve!", color: "#ff6b6b" };
  };
  const getCgpaTargetMessage = (gpa) => {
    const numGpa = Number(gpa);
    if (numGpa > 10.0) return { message: "🎯 Target is impossible to reach!", color: "#ff6b6b" };
    if (numGpa >= 9.5) return { message: "A perfect semester is required! Go for it!", color: "#FF6600" }; // Orange
    if (numGpa >= 9.0) return { message: "Tough, but achievable!", color: "#FFA500" }; // Lighter Orange
    if (numGpa >= 8.0) return { message: "This is a solid goal. You can do this!", color: "#ffffff" };
    if (numGpa <= 0) return { message: "This is guaranteed, even if you fail!", color: "#FF6600" }; // Orange
    return { message: "A very manageable target. Stay focused!", color: "#c0c0c0" };
  };
  const getSgpaTargetMessage = (avgPoint) => {
    const points = Number(avgPoint);
    if (points > 10.0) return { message: "Impossible! Your locked grades are too low.", color: "#ff6b6b" };
    if (points >= 9.5) return { message: "You need to average an 'O' in your other subjects.", color: "#FF6600" }; // Orange
    if (points >= 8.5) return { message: "You need to average an 'A+' or better.", color: "#FFA500" }; // Lighter Orange
    if (points >= 7.5) return { message: "You need to average an 'A' or better.", color: "#ffffff" };
    if (points <= 0) return { message: "Target is guaranteed even if you fail others!", color: "#FF6600" }; // Orange
    return { message: `Aim for an average of ${getGradeFromPoints(points)} in your other subjects.`, color: "#c0c0c0" };
  };

  // --- Styles (Colors Updated) ---
  const styles = {
    header: {
      fontSize: '2.5em', fontWeight: 'bold', color: '#ffffff',
      marginBottom: '30px', borderBottom: '2px solid #FF6600',
      paddingBottom: '10px', textShadow: '0 0 5px #FF6600',
    },
    inputGrid: {
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px',
      marginBottom: '20px', padding: '25px', backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)', borderRadius: '10px', border: '1px solid rgba(255, 102, 0, 0.2)',
    },
    inputGridTarget: {
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px',
      marginBottom: '20px', padding: '25px', backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)', borderRadius: '10px', border: '1px solid rgba(255, 102, 0, 0.2)',
    },
    inputWrapper: { position: 'relative' },
    inputLabel: { color: '#c0c0c0', marginBottom: '8px', fontSize: '0.9em' },
    input: {
      width: '100%', padding: '15px', boxSizing: 'border-box', border: '1px solid #2E1A00',
      borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#ffffff', fontSize: '1em',
    },
    select: {
      width: '100%', padding: '15px', boxSizing: 'border-box', border: '1px solid #2E1A00',
      borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#ffffff', fontSize: '1em', appearance: 'none',
    },
    addButton: {
      padding: '15px', backgroundColor: '#FF6600', color: '#000000',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1em',
      fontWeight: 'bold', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '10px', marginTop: '23px',
    },
    error: {
      padding: '15px', backgroundColor: 'rgba(255, 50, 50, 0.2)', border: '1px solid #ff3232',
      borderRadius: '8px', marginBottom: '20px', color: '#ffadad',
      textAlign: 'center', fontWeight: 'bold',
    },
    gpaLayout: {
      display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px',
    },
    gpaLayoutSingle: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    courseListCard: {
      padding: '25px', backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)', borderRadius: '10px',
      border: '1px solid rgba(255, 102, 0, 0.2)',
    },
    gpaResultCard: {
      padding: '25px', backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)', borderRadius: '10px',
      border: '1px solid rgba(255, 102, 0, 0.2)', textAlign: 'center',
      display: 'flex', flexDirection: 'column', 
    },
    subHeader: {
      fontSize: '1.5em', color: '#FF6600', marginBottom: '15px',
      display: 'flex', alignItems: 'center', gap: '10px',
    },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: {
      borderBottom: '2px solid #FF6600', padding: '12px',
      textAlign: 'left', color: '#ffffff',
    },
    td: { borderBottom: '1px solid #2E1A00', padding: '12px', verticalAlign: 'middle' },
    deleteButton: { background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' },
    gpaDisplay: {
      fontSize: '5em', fontWeight: 'bold', color: '#FF6600', // <<< --- COLOR FIXED
      margin: '10px 0', textShadow: '0 0 20px #FF6600', // <<< --- COLOR FIXED
    },
    gpaButton: {
      padding: '15px', backgroundColor: '#FF6600', color: '#000000', // <<< --- COLOR FIXED
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '1.2em', fontWeight: 'bold', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%',
    },
    clearButton: {
      background: 'none', border: '1px solid #ff6b6b', color: '#ff6b6b',
      padding: '10px', borderRadius: '8px', cursor: 'pointer',
      width: '100%', marginTop: '10px',
    },
    modeSwitcher: {
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: '10px', marginBottom: '20px',
      border: '1px solid #2E1A00', borderRadius: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '5px',
    },
    modeButton: {
      flex: 1, padding: '12px', background: 'none', border: 'none',
      borderRadius: '6px', color: '#c0c0c0', cursor: 'pointer',
      fontSize: '0.9em', 
      fontWeight: '500', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: '8px',
      transition: 'all 0.3s ease',
    },
    modeButtonActive: {
      flex: 1, padding: '12px', border: 'none', borderRadius: '6px',
      color: '#000000', cursor: 'pointer', fontSize: '0.9em', 
      fontWeight: 'bold', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '8px',
      transition: 'all 0.3s ease',
      backgroundColor: '#FF6600', boxShadow: '0 0 15px #FF6600',
    },
    gpaMessage: {
      fontSize: '1.1em',
      fontWeight: '500',
      color: '#c0c0c0', 
      marginTop: '0px',
      marginBottom: '25px', 
      minHeight: '30px', 
      transition: 'color 0.3s ease',
    },
    lockButton: {
      background: 'none', border: '1px solid #FF6600',
      color: '#FF6600', cursor: 'pointer',
      borderRadius: '5px', padding: '5px 8px',
      display: 'flex', alignItems: 'center', gap: '5px'
    },
    lockButtonLocked: {
      background: '#FF6600', border: '1px solid #FF6600',
      color: '#000000', cursor: 'pointer',
      borderRadius: '5px', padding: '5px 8px',
      display: 'flex', alignItems: 'center', gap: '5px'
    },
    smallSelect: {
      padding: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid #2E1A00',
      color: '#ffffff',
      borderRadius: '5px'
    }
  };

  // --- Animation Variants ---
  const boxVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const neonGlow = { // Orange Glow
    scale: 1.05, 
    boxShadow: '0 0 15px #FF6600, 0 0 25px #FF6600' 
  };
  const orangeGlow = { // <<< --- FIXED
    scale: 1.05, 
    boxShadow: '0 0 15px #FF6600, 0 0 25px #FF6600' 
  };
  const redGlow = { 
    scale: 1.05, 
    boxShadow: '0 0 15px #ff6b6b' 
  };
  const redIconGlow = { 
    scale: 1.2, 
    color: '#ff0000', 
    textShadow: '0 0 10px #ff6b6b' 
  };

  // --- Render Functions ---
  const renderSgpaCalculator = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div style={styles.inputGrid} variants={boxVariants} initial="initial" animate="animate">
        <div>
          <div style={styles.inputLabel}>Select Grade</div>
          <select style={styles.select} value={currentGrade} onChange={(e) => setCurrentGrade(e.target.value)}>
            {Object.keys(GRADE_POINTS).map(grade => ( <option key={grade} value={grade}>{grade}</option> ))}
          </select>
        </div>
        <div>
          <div style={styles.inputLabel}>Enter Credits</div>
          <input type="number" value={currentCredits} onChange={(e) => setCurrentCredits(e.target.value)} placeholder="e.g., 3" style={styles.input} />
        </div>
        <motion.button style={styles.addButton} onClick={addCourse} 
          whileHover={neonGlow} whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Course
        </motion.button>
      </motion.div>
      <motion.div style={styles.gpaLayout} variants={boxVariants} initial="initial" animate="animate">
        <div style={styles.courseListCard}>
          <h4 style={styles.subHeader}>📋 Course List</h4>
          {courses.length === 0 ? (<p style={{color: '#c0c0c0'}}>Your added courses will appear here.</p>) : (
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Grade</th><th style={styles.th}>Credits</th><th style={styles.th}>Action</th></tr></thead>
              <tbody><AnimatePresence>
                {courses.map((course) => (
                  <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td style={styles.td}>{course.grade}</td><td style={styles.td}>{course.credits}</td>
                    <td style={styles.td}>
                      <motion.button style={styles.deleteButton} onClick={() => deleteCourse(course.id)} 
                        whileHover={redIconGlow}
                      >
                        <FaTrash />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence></tbody>
            </table>
          )}
        </div>
        <div style={styles.gpaResultCard}>
          <div>
            <h4 style={styles.subHeader}>⭐ Your SGPA</h4>
            <div style={styles.gpaDisplay}>{finalSgpa ? finalSgpa : '-.--'}</div>
            <div style={{...styles.gpaMessage, color: finalSgpa ? getGpaMessage(finalSgpa).color : '#c0c0c0'}}>
              {finalSgpa ? getGpaMessage(finalSgpa).message : 'Calculate to see feedback.'}
            </div>
          </div>
          <div>
            <motion.button style={styles.gpaButton} onClick={calculateSgpa} 
              whileHover={orangeGlow} whileTap={{ scale: 0.95 }} // <<< --- FIXED
            >
              🧮 Calculate
            </motion.button>
            <motion.button style={styles.clearButton} onClick={clearSgpa} 
              whileHover={redGlow}
            >
              🔄 Clear All
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderCgpaCalculator = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div style={styles.inputGrid} variants={boxVariants} initial="initial" animate="animate">
        <div>
          <div style={styles.inputLabel}>Enter Semester SGPA</div>
          <input type="number" value={currentSemesterGpa} onChange={(e) => setCurrentSemesterGpa(e.target.value)} placeholder="e.g., 8.86" style={styles.input} />
        </div>
        <div>
          <div style={styles.inputLabel}>Enter Total Semester Credits</div>
          <input type="number" value={currentSemesterCredits} onChange={(e) => setCurrentSemesterCredits(e.target.value)} placeholder="e.g., 21" style={styles.input} />
        </div>
        <motion.button style={styles.addButton} onClick={addSemester} 
          whileHover={neonGlow} whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Semester
        </motion.button>
      </motion.div>
      <motion.div style={styles.gpaLayout} variants={boxVariants} initial="initial" animate="animate">
        <div style={styles.courseListCard}>
          <h4 style={styles.subHeader}>📋 Semester List</h4>
          {semesters.length === 0 ? (<p style={{color: '#c0c0c0'}}>Your added semesters will appear here.</p>) : (
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>SGPA</th><th style={styles.th}>Credits</th><th style={styles.th}>Action</th></tr></thead>
              <tbody><AnimatePresence>
                {semesters.map((sem) => (
                  <motion.tr key={sem.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td style={styles.td}>{sem.sgpa.toFixed(2)}</td><td style={styles.td}>{sem.credits}</td>
                    <td style={styles.td}>
                      <motion.button style={styles.deleteButton} onClick={() => deleteSemester(sem.id)} 
                        whileHover={redIconGlow}
                      >
                        <FaTrash />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence></tbody>
            </table>
          )}
        </div>
        <div style={styles.gpaResultCard}>
          <div>
            <h4 style={styles.subHeader}>🏆 Your CGPA</h4>
            <div style={styles.gpaDisplay}>{finalCgpa ? finalCgpa : '-.--'}</div>
            <div style={{...styles.gpaMessage, color: finalCgpa ? getGpaMessage(finalCgpa).color : '#c0c0c0'}}>
              {finalCgpa ? getGpaMessage(finalCgpa).message : 'Calculate to see feedback.'}
            </div>
          </div>
          <div>
            <motion.button style={styles.gpaButton} onClick={calculateCgpa} 
              whileHover={orangeGlow} whileTap={{ scale: 0.95 }} // <<< --- FIXED
            >
              🧮 Calculate
            </motion.button>
            <motion.button style={styles.clearButton} onClick={clearCgpa} 
              whileHover={redGlow}
            >
              🔄 Clear All
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
  
  const renderCgpaTargetCalculator = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div style={styles.inputGridTarget} variants={boxVariants} initial="initial" animate="animate">
        <div>
          <div style={styles.inputLabel}>Your Dream CGPA</div>
          <input type="number" value={targetCgpa} onChange={(e) => setTargetCgpa(e.target.value)} placeholder="e.g., 9.0" style={styles.input} />
        </div>
        <div>
          <div style={styles.inputLabel}>Current Semester Credits</div>
          <input type="number" value={currentSemCreditsForCgpa} onChange={(e) => setCurrentSemCreditsForCgpa(e.target.value)} placeholder="e.g., 21" style={styles.input} />
        </div>
        <motion.button style={styles.addButton} onClick={calculateRequiredSgpa} 
          whileHover={neonGlow} whileTap={{ scale: 0.95 }}
        >
          <FaCalculator /> Calculate Target
        </motion.button>
      </motion.div>
      <AnimatePresence>
        {requiredSgpa !== null && (
          <motion.div 
            style={styles.gpaLayoutSingle} 
            variants={boxVariants} 
            initial="initial" 
            animate="animate" 
            exit={{ opacity: 0, y: 50 }}
          >
            <div style={{...styles.gpaResultCard, width: '400px'}}>
              <div>
                <h4 style={styles.subHeader}>🎯 Required SGPA</h4>
                <div style={{...styles.gpaDisplay, color: requiredSgpa > 10 ? '#ff6b6b' : '#FF6600'}}>
                  {requiredSgpa > 10 ? "> 10" : requiredSgpa}
                </div>
                <div style={{...styles.gpaMessage, color: getCgpaTargetMessage(requiredSgpa).color}}>
                  {getCgpaTargetMessage(requiredSgpa).message}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderSgpaTargetCalculator = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div style={styles.inputGrid} variants={boxVariants} initial="initial" animate="animate">
        <div>
          <div style={styles.inputLabel}>Course Name</div>
          <input type="text" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="e.g., Data Structures" style={styles.input} />
        </div>
        <div>
          <div style={styles.inputLabel}>Course Credits</div>
          <input type="number" value={newCourseCredits} onChange={(e) => setNewCourseCredits(e.target.value)} placeholder="e.g., 4" style={styles.input} />
        </div>
        <motion.button style={styles.addButton} onClick={addSgpaTargetCourse} 
          whileHover={neonGlow} whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Course
        </motion.button>
      </motion.div>
      <motion.div style={styles.gpaLayout} variants={boxVariants} initial="initial" animate="animate">
        <div style={styles.courseListCard}>
          <h4 style={styles.subHeader}>📋 Current Semester Courses</h4>
          {sgpaTargetCourses.length === 0 ? (<p style={{color: '#c0c0c0'}}>Add your courses for this semester.</p>) : (
            <table style={styles.table}>
              <thead><tr>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Credits</th>
                <th style={styles.th}>Grade</th>
                <th style={styles.th}>Lock</th>
                <th style={styles.th}>Del</th>
              </tr></thead>
              <tbody><AnimatePresence>
                {sgpaTargetCourses.map((course) => (
                  <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td style={styles.td}>{course.name}</td>
                    <td style={styles.td}>{course.credits}</td>
                    <td style={styles.td}>
                      <select 
                        style={styles.smallSelect} 
                        value={course.grade} 
                        onChange={(e) => updateSgpaTargetCourse(course.id, 'grade', e.target.value)}
                        disabled={!course.isLocked}
                      >
                        {Object.keys(GRADE_POINTS).map(grade => ( <option key={grade} value={grade}>{grade}</option>))}
                      </select>
                    </td>
                    <td style={styles.td}>
                      <motion.button 
                        style={course.isLocked ? styles.lockButtonLocked : styles.lockButton}
                        onClick={() => updateSgpaTargetCourse(course.id, 'isLocked', !course.isLocked)}
                        whileHover={{scale: 1.1}}
                      >
                        {course.isLocked ? <FaLock /> : <FaLockOpen />}
                      </motion.button>
                    </td>
                    <td style={styles.td}>
                      <motion.button style={styles.deleteButton} onClick={() => deleteSgpaTargetCourse(course.id)} 
                        whileHover={redIconGlow}
                      >
                        <FaTrash />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence></tbody>
            </table>
          )}
        </div>
        <div style={styles.gpaResultCard}>
          <div>
            <h4 style={styles.subHeader}>🎯 Your Target</h4>
            <div style={styles.inputWrapper}>
              <div style={styles.inputLabel}>Enter Target SGPA</div>
              <input type="number" value={sgpaTargetGoal} onChange={(e) => setSgpaTargetGoal(e.target.value)} placeholder="e.g., 9.0" style={styles.input} />
            </div>
            
            {sgpaTargetResult && (
              <AnimatePresence>
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{marginTop: '20px'}}>
                  <h4 style={styles.subHeader}>Required Average</h4>
                  <div style={{...styles.gpaDisplay, color: sgpaTargetResult.avgPoint > 10 ? '#ff6b6b' : '#FF6600'}}>
                    {sgpaTargetResult.avgPoint > 10 ? "> 10" : sgpaTargetResult.avgPoint}
                  </div>
                  <div style={{...styles.gpaMessage, color: getSgpaTargetMessage(sgpaTargetResult.avgPoint).color}}>
                    {getSgpaTargetMessage(sgpaTargetResult.avgPoint).message}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div>
            <motion.button style={styles.gpaButton} onClick={calculateSgpaTarget} 
              whileHover={orangeGlow} whileTap={{ scale: 0.95 }} // <<< --- FIXED
            >
              🧮 Calculate
            </motion.button>
            <motion.button style={styles.clearButton} onClick={clearSgpaTarget} 
              whileHover={redGlow}
            >
              🔄 Clear All
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={styles.header}>🚀 GPA Calculator Engine</h2>

      <div style={styles.modeSwitcher}>
        <motion.button 
          style={mode === 'sgpa' ? styles.modeButtonActive : styles.modeButton}
          onClick={() => { setMode('sgpa'); setError(null); }}
          whileHover={mode !== 'sgpa' ? { boxShadow: '0 0 10px #FF6600', backgroundColor: 'rgba(255, 102, 0, 0.1)'} : {}}
        >
          <FaBook /> SGPA
        </motion.button>
        <motion.button 
          style={mode === 'cgpa' ? styles.modeButtonActive : styles.modeButton}
          onClick={() => { setMode('cgpa'); setError(null); }}
          whileHover={mode !== 'cgpa' ? { boxShadow: '0 0 10px #FF6600', backgroundColor: 'rgba(255, 102, 0, 0.1)'} : {}}
        >
          <FaLayerGroup /> CGPA
        </motion.button>
        <motion.button 
          style={mode === 'cgpaTarget' ? styles.modeButtonActive : styles.modeButton}
          onClick={() => { setMode('cgpaTarget'); setError(null); }}
          whileHover={mode !== 'cgpaTarget' ? { boxShadow: '0 0 10px #FF6600', backgroundColor: 'rgba(255, 102, 0, 0.1)'} : {}}
        >
          <FaCrosshairs /> CGPA Target
        </motion.button>
        <motion.button 
          style={mode === 'sgpaTarget' ? styles.modeButtonActive : styles.modeButton}
          onClick={() => { setMode('sgpaTarget'); setError(null); }}
          whileHover={mode !== 'sgpaTarget' ? { boxShadow: '0 0 10px #FF6600', backgroundColor: 'rgba(255, 102, 0, 0.1)'} : {}}
        >
          <FaBullseye /> SGPA Target
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div style={styles.error}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {mode === 'sgpa' && renderSgpaCalculator()}
          {mode === 'cgpa' && renderCgpaCalculator()}
          {mode === 'cgpaTarget' && renderCgpaTargetCalculator()}
          {mode === 'sgpaTarget' && renderSgpaTargetCalculator()}
        </motion.div>
      </AnimatePresence>
      
    </motion.div>
  );
};

export default GpaCalculator;