import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaTrash, FaCalculator, FaStar, FaListAlt, FaBook, FaLayerGroup,
  FaCrosshairs, FaBullseye, FaLock, FaLockOpen,
  FaLightbulb, FaEllipsisV // <<< --- Added FaEllipsisV
} from 'react-icons/fa';

// --- Logic (All unchanged) ---
const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'RA': 0, 'Fail': 0,
};
const getGradeFromPoints = (points) => {
  points = Number(points);
  if (points >= 9.5) return 'O';
  if (points >= 8.5) return 'A+';
  if (points >= 7.5) return 'A';
  if (points >= 6.5) return 'B+';
  if (points >= 5.5) return 'B';
  if (points >= 5.0) return 'C';
  return 'Fail';
};
const getPriorityTip = (course) => {
  const points = GRADE_POINTS[course.grade];
  
  if (course.grade === 'O') {
    return {
      text: `For ${course.name}: 'O' Grade - No need to worry! You're acing this.`,
      color: '#69f0ae', type: 'green'
    };
  }
  if (course.grade === 'A+') {
    return {
      text: `For ${course.name}: 'A+' Grade - Excellent! It's better to maintain this.`,
      color: '#b3e0ff', type: 'blue'
    };
  }
  if (course.grade === 'A') {
    return {
      text: `For ${course.name}: 'A' Grade - Good job! Just need to concentrate a bit more.`,
      color: '#fffcb3', type: 'yellow'
    };
  }
  if (course.grade === 'B+') {
    return {
      text: `For ${course.name}: 'B+' Grade - Solid, but you have room to improve. Push for an 'A'!`,
      color: '#ffe0b3', type: 'orange'
    };
  }
  if (course.grade === 'B') {
    return {
      text: `For ${course.name}: 'B' Grade - You need to pay more attention in this course. Focus on key concepts.`,
      color: '#ffb3e0', type: 'pink'
    };
  }
  if (course.grade === 'C') {
    return {
      text: `For ${course.name}: 'C' Grade - This needs your immediate concentration. Don't let your SGPA drop!`,
      color: '#ffb3e0', type: 'pink'
    };
  }
  if (course.grade === 'RA' || course.grade === 'Fail') {
    return {
      text: `For ${course.name}: 'Fail' or 'RA' - Better luck next time! This requires a significant re-evaluation.`,
      color: '#ffb3b3', type: 'red'
    };
  }
  return { 
    text: `An '${course.grade}' in ${course.name} is a solid, stable grade. Keep it up.`, 
    color: '#e0e0e0', type: 'gray'
  };
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
  const [plannerCourses, setPlannerCourses] = useState([]);
  const [plannerSgpa, setPlannerSgpa] = useState(0.00);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState('');
  const [newCourseDifficulty, setNewCourseDifficulty] = useState('Medium');
  const [plannerTips, setPlannerTips] = useState([]); 
  const [error, setError] = useState(null);
  
  // --- NEW: State for info popups ---
  const [activePopup, setActivePopup] = useState(null); // 'sgpa', 'cgpa', 'cgpaTarget', 'sgpaPlanner'

  // --- NEW: Toggle function for popups ---
  const togglePopup = (popupName, e) => {
    e.stopPropagation(); // Stop the click from switching the tab
    setActivePopup(activePopup === popupName ? null : popupName);
  };

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
  const addPlannerCourse = () => {
    setError(null);
    const credits = Number(newCourseCredits);
    if (!newCourseName.trim()) {
      setError("Please enter a course name."); return;
    }
    if (isNaN(credits) || credits <= 0 || credits > 10) {
      setError("Please enter valid credits (e.g., 4)."); return;
    }
    const newCourse = {
      id: Date.now(), name: newCourseName, credits: credits,
      difficulty: newCourseDifficulty, grade: 'O',
    };
    setPlannerCourses([...plannerCourses, newCourse]);
    setNewCourseName('');
    setNewCourseCredits('');
  };
  const deletePlannerCourse = (id) => {
    setPlannerCourses(plannerCourses.filter(c => c.id !== id));
  };
  const updatePlannerCourse = (id, field, value) => {
    setPlannerCourses(plannerCourses.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };
  useEffect(() => {
    if (plannerCourses.length === 0) {
      setPlannerSgpa(0.00);
      setPlannerTips([]);
      return;
    }
    let totalPoints = 0;
    let totalCredits = 0;
    const newTips = [];
    plannerCourses.forEach(course => {
      const points = GRADE_POINTS[course.grade];
      totalPoints += points * course.credits;
      totalCredits += course.credits;
      newTips.push({ id: course.id, ...getPriorityTip(course) });
    });
    if (totalCredits === 0) {
      setPlannerSgpa(0.00);
    } else {
      setPlannerSgpa((totalPoints / totalCredits).toFixed(2));
    }
    setPlannerTips(newTips);
  }, [plannerCourses]);
  const clearPlanner = () => {
    setPlannerCourses([]);
    setNewCourseName('');
    setNewCourseCredits('');
    setError(null);
  };
  
  const getGpaMessage = (gpa) => {
    const numGpa = Number(gpa);
    if (numGpa >= 9.0) return { message: "🎉 Outstanding! Well done!", color: "#FF6600" };
    if (numGpa >= 8.0) return { message: "🥳 Excellent! Keep doing well!", color: "#FFA500" };
    if (numGpa >= 7.0) return { message: "👍 Good work! Keep pushing!", color: "#ffffff" };
    if (numGpa >= 6.0) return { message: "💪 Solid effort. Aim higher!", color: "#ff9e80" };
    return { message: "📈 You passed. Let's improve!", color: "#ff6b6b" };
  };
  const getCgpaTargetMessage = (gpa) => {
    const numGpa = Number(gpa);
    if (numGpa > 10.0) return { message: "🎯 Target is impossible to reach!", color: "#ff6b6b" };
    if (numGpa >= 9.5) return { message: "A perfect semester is required! Go for it!", color: "#FF6600" };
    if (numGpa >= 9.0) return { message: "Tough, but achievable!", color: "#FFA500" };
    if (numGpa >= 8.0) return { message: "This is a solid goal. You can do this!", color: "#ffffff" };
    if (numGpa <= 0) return { message: "This is guaranteed, even if you fail!", color: "#FF6600" };
    return { message: "A very manageable target. Stay focused!", color: "#c0c0c0" };
  };

  const boxVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const neonGlow = { 
    scale: 1.05, 
    boxShadow: '0 0 15px #FF6600, 0 0 25px #FF6600' 
  };
  const orangeGlow = { 
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

  const renderSgpaCalculator = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="input-grid" variants={boxVariants} initial="initial" animate="animate">
        <div>
          <div className="input-label">Select Grade</div>
          <select className="select" value={currentGrade} onChange={(e) => setCurrentGrade(e.target.value)}>
            {Object.keys(GRADE_POINTS).map(grade => ( <option key={grade} value={grade}>{grade}</option> ))}
          </select>
        </div>
        <div>
          <div className="input-label">Enter Credits</div>
          <input type="number" value={currentCredits} onChange={(e) => setCurrentCredits(e.target.value)} placeholder="e.g., 3" className="input" />
        </div>
        <motion.button className="add-button" onClick={addCourse} 
          whileHover={neonGlow} whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Course
        </motion.button>
      </motion.div>
      <motion.div className="gpa-layout" variants={boxVariants} initial="initial" animate="animate">
        <div className="course-list-card">
          <h4 className="sub-header">📋 Course List</h4>
          {courses.length === 0 ? (<p className="placeholder-text">Your added courses will appear here.</p>) : (
            <table className="table">
              <thead><tr><th className="th">Grade</th><th className="th">Credits</th><th className="th">Action</th></tr></thead>
              <tbody><AnimatePresence>
                {courses.map((course) => (
                  <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td className="td">{course.grade}</td><td className="td">{course.credits}</td>
                    <td className="td">
                      <motion.button className="delete-button" onClick={() => deleteCourse(course.id)} 
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
        <div className="gpa-result-card">
          <div>
            <h4 className="sub-header">⭐ Your SGPA</h4>
            <div className="gpa-display">{finalSgpa ? finalSgpa : '-.--'}</div>
            <div className="gpa-message" style={{color: finalSgpa ? getGpaMessage(finalSgpa).color : '#c0c0c0'}}>
              {finalSgpa ? getGpaMessage(finalSgpa).message : 'Calculate to see feedback.'}
            </div>
          </div>
          <div>
            <motion.button className="gpa-button" onClick={calculateSgpa} 
              whileHover={orangeGlow} whileTap={{ scale: 0.95 }}
            >
              🧮 Calculate
            </motion.button>
            <motion.button className="clear-button" onClick={clearSgpa} 
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
      <motion.div className="input-grid" variants={boxVariants} initial="initial" animate="animate">
        <div>
          <div className="input-label">Enter Semester SGPA</div>
          <input type="number" value={currentSemesterGpa} onChange={(e) => setCurrentSemesterGpa(e.target.value)} placeholder="e.g., 8.86" className="input" />
        </div>
        <div>
          <div className="input-label">Enter Total Semester Credits</div>
          <input type="number" value={currentSemesterCredits} onChange={(e) => setCurrentSemesterCredits(e.target.value)} placeholder="e.g., 21" className="input" />
        </div>
        <motion.button className="add-button" onClick={addSemester} 
          whileHover={neonGlow} whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Semester
        </motion.button>
      </motion.div>
      <motion.div className="gpa-layout" variants={boxVariants} initial="initial" animate="animate">
        <div className="course-list-card">
          <h4 className="sub-header">📋 Semester List</h4>
          {semesters.length === 0 ? (<p className="placeholder-text">Your added semesters will appear here.</p>) : (
            <table className="table">
              <thead><tr><th className="th">SGPA</th><th className="th">Credits</th><th className="th">Action</th></tr></thead>
              <tbody>
                {/* --- THIS IS THE FIX for the typo --- */}
                <AnimatePresence>
                  {semesters.map((sem) => (
                    <motion.tr key={sem.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td className="td">{sem.sgpa.toFixed(2)}</td><td className="td">{sem.credits}</td>
                      <td className="td">
                        <motion.button className="delete-button" onClick={() => deleteSemester(sem.id)} 
                          whileHover={redIconGlow}
                        >
                          <FaTrash />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
        <div className="gpa-result-card">
          <div>
            <h4 className="sub-header">🏆 Your CGPA</h4>
            <div className="gpa-display">{finalCgpa ? finalCgpa : '-.--'}</div>
            <div className="gpa-message" style={{color: finalCgpa ? getGpaMessage(finalCgpa).color : '#c0c0c0'}}>
              {finalCgpa ? getGpaMessage(finalCgpa).message : 'Calculate to see feedback.'}
            </div>
          </div>
          <div>
            <motion.button className="gpa-button" onClick={calculateCgpa} 
              whileHover={orangeGlow} whileTap={{ scale: 0.95 }}
            >
              🧮 Calculate
            </motion.button>
            <motion.button className="clear-button" onClick={clearCgpa} 
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
      <motion.div className="input-grid-target" variants={boxVariants} initial="initial" animate="animate">
        <div>
          <div className="input-label">Your Dream CGPA</div>
          <input type="number" value={targetCgpa} onChange={(e) => setTargetCgpa(e.target.value)} placeholder="e.g., 9.0" className="input" />
        </div>
        <div>
          <div className="input-label">Current Semester Credits</div>
          <input type="number" value={currentSemCreditsForCgpa} onChange={(e) => setCurrentSemCreditsForCgpa(e.target.value)} placeholder="e.g., 21" className="input" />
        </div>
        <motion.button className="add-button" onClick={calculateRequiredSgpa} 
          whileHover={neonGlow} whileTap={{ scale: 0.95 }}
        >
          <FaCalculator /> Calculate Target
        </motion.button>
      </motion.div>
      <AnimatePresence>
        {requiredSgpa !== null && (
          <motion.div 
            className="gpa-layout-single" 
            variants={boxVariants} 
            initial="initial" 
            animate="animate" 
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="gpa-result-card" style={{width: '400px'}}>
              <div>
                <h4 className="sub-header">🎯 Required SGPA</h4>
                <div className="gpa-display" style={{color: requiredSgpa > 10 ? '#ff6b6b' : '#FF6600'}}>
                  {requiredSgpa > 10 ? "> 10" : requiredSgpa}
                </div>
                <div className="gpa-message" style={{color: getCgpaTargetMessage(requiredSgpa).color}}>
                  {getCgpaTargetMessage(requiredSgpa).message}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderSgpaPlanner = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="input-grid-4col" variants={boxVariants} initial="initial" animate="animate">
        <div>
          <div className="input-label">Course Name</div>
          <input type="text" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="e.g., Data Structures" className="input" />
        </div>
        <div>
          <div className="input-label">Course Credits</div>
          <input type="number" value={newCourseCredits} onChange={(e) => setNewCourseCredits(e.target.value)} placeholder="e.g., 4" className="input" />
        </div>
        <div>
          <div className="input-label">Difficulty</div>
          <select className="select" value={newCourseDifficulty} onChange={(e) => setNewCourseDifficulty(e.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <motion.button className="add-button" onClick={addPlannerCourse} 
          whileHover={neonGlow} whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add
        </motion.button>
      </motion.div>
      
      <motion.div className="gpa-layout" variants={boxVariants} initial="initial" animate="animate">
        <div className="course-list-card">
          <h4 className="sub-header">📋 Current Semester Courses</h4>
          {plannerCourses.length === 0 ? (<p className="placeholder-text">Add your courses to plan your SGPA.</p>) : (
            <table className="table">
              <thead><tr>
                <th className="th">Course</th>
                <th className="th">Credits</th>
                <th className="th">Difficulty</th>
                <th className="th">Target Grade</th>
                <th className="th">Del</th>
              </tr></thead>
              <tbody><AnimatePresence>
                {plannerCourses.map((course) => {
                  return (
                    <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td className="td">{course.name}</td>
                      <td className="td">{course.credits}</td>
                      <td className="td">{course.difficulty}</td>
                      <td className="td">
                        <select 
                          className="small-select" 
                          value={course.grade} 
                          onChange={(e) => updatePlannerCourse(course.id, 'grade', e.target.value)}
                        >
                          {Object.keys(GRADE_POINTS).map(grade => ( <option key={grade} value={grade}>{grade}</option>))}
                        </select>
                      </td>
                      <td className="td">
                        <motion.button className="delete-button" onClick={() => deletePlannerCourse(course.id)} 
                          whileHover={redIconGlow}
                        >
                          <FaTrash />
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence></tbody>
            </table>
          )}
        </div>
        
        <div className="gpa-result-card">
          <div>
            <h4 className="sub-header">✨ Your Planned SGPA</h4>
            <div className="gpa-display">
              {plannerSgpa}
            </div>
            <div className="gpa-message" style={{color: getGpaMessage(plannerSgpa).color}}>
              {getGpaMessage(plannerSgpa).message}
            </div>
          </div>
          
          <div style={{marginTop: 'auto'}}> 
            <motion.button className="clear-button" onClick={clearPlanner} 
              whileHover={redGlow}
            >
              🔄 Clear All Courses
            </motion.button>
          </div>
        </div>
      </motion.div>

      {plannerCourses.length > 0 && (
        <motion.div 
          className="tip-card-container"
          variants={boxVariants} initial="initial" animate="animate"
        >
          <h4 className="sub-header"><FaLightbulb /> Strategic Insights</h4>
          <AnimatePresence>
            {plannerTips.map(tip => (
              <motion.div 
                key={tip.id} 
                className={`tip-card tip-card-${tip.type}`}
                style={{'--random-rotation': Math.random()}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="tip-pin"></div>
                <span>{tip.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- THIS IS THE FIX --- */}
      {/* The header is now outside the AnimatePresence block */}
      <h2 className="page-header">🚀 GPA Calculator Engine</h2>

      <div className="mode-switcher">
        <div className="mode-button-wrapper">
          <motion.button 
            className={mode === 'sgpa' ? "mode-button-active" : "mode-button"}
            onClick={() => { setMode('sgpa'); setError(null); }}
            whileHover={mode !== 'sgpa' ? { boxShadow: '0 0 10px #FF6600', backgroundColor: 'rgba(255, 102, 0, 0.1)'} : {}}
          >
            <span><FaBook /> SGPA</span>
            <motion.span className="info-icon" onClick={(e) => togglePopup('sgpa', e)} whileHover={{scale: 1.2}}>
              <FaEllipsisV />
            </motion.span>
          </motion.button>
          <AnimatePresence>
            {activePopup === 'sgpa' && (
              <motion.div className="mode-popup" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}>
                <h4>What is "SGPA (Past)"?</h4>
                <p>Use this to calculate your SGPA for a single, completed semester. Just add all your courses, grades, and credits.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mode-button-wrapper">
          <motion.button 
            className={mode === 'cgpa' ? "mode-button-active" : "mode-button"}
            onClick={() => { setMode('cgpa'); setError(null); }}
            whileHover={mode !== 'cgpa' ? { boxShadow: '0 0 10px #FF6600', backgroundColor: 'rgba(255, 102, 0, 0.1)'} : {}}
          >
            <span><FaLayerGroup /> CGPA</span>
            <motion.span className="info-icon" onClick={(e) => togglePopup('cgpa', e)} whileHover={{scale: 1.2}}>
              <FaEllipsisV />
            </motion.span>
          </motion.button>
          <AnimatePresence>
            {activePopup === 'cgpa' && (
              <motion.div className="mode-popup" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}>
                <h4>What is "CGPA (Overall)"?</h4>
                <p>Use this to calculate your *overall* CGPA. Add the final SGPA and total credits for each semester you have completed.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mode-button-wrapper">
          <motion.button 
            className={mode === 'cgpaTarget' ? "mode-button-active" : "mode-button"}
            onClick={() => { setMode('cgpaTarget'); setError(null); }}
            whileHover={mode !== 'cgpaTarget' ? { boxShadow: '0 0 10px #FF6600', backgroundColor: 'rgba(255, 102, 0, 0.1)'} : {}}
          >
            <span><FaCrosshairs /> CGPA Target</span>
            <motion.span className="info-icon" onClick={(e) => togglePopup('cgpaTarget', e)} whileHover={{scale: 1.2}}>
              <FaEllipsisV />
            </motion.span>
          </motion.button>
          <AnimatePresence>
            {activePopup === 'cgpaTarget' && (
              <motion.div className="mode-popup" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}>
                <h4>What is "CGPA Target"?</h4>
                <p>This tells you the "magic number." Enter your past semesters in the CGPA tab, then come here. Tell it your goal (e.g., 9.0) and it will tell you the SGPA you need *this* semester to get it.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mode-button-wrapper">
          <motion.button 
            className={mode === 'sgpaPlanner' ? "mode-button-active" : "mode-button"}
            onClick={() => { setMode('sgpaPlanner'); setError(null); }}
            whileHover={mode !== 'sgpaPlanner' ? { boxShadow: '0 0 10px #FF6600', backgroundColor: 'rgba(255, 102, 0, 0.1)'} : {}}
          >
            <span><FaBullseye /> SGPA Target</span>
            <motion.span className="info-icon" onClick={(e) => togglePopup('sgpaPlanner', e)} whileHover={{scale: 1.2}}>
              <FaEllipsisV />
            </motion.span>
          </motion.button>
          <AnimatePresence>
            {activePopup === 'sgpaPlanner' && (
              <motion.div className="mode-popup" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}>
                <h4>What is "SGPA Target"?</h4>
                <p>This is your strategic planner. Add all your courses for your *current* semester (with difficulty) and change the grades to see how it affects your final SGPA in real-time.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div className="error-message"
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
          {mode === 'sgpaPlanner' && renderSgpaPlanner()}
        </motion.div>
      </AnimatePresence>
      
    </motion.div>
  );
};

export default GpaCalculator;