import React, { useState } from 'react';

// --- 1. Grading Formula & Logic ---
const GRADE_MIN_MARKS = [
  { grade: 'O', min: 91, max: 100 },
  { grade: 'A+', min: 81, max: 90 },
  { grade: 'A', min: 71, max: 80 },
  { grade: 'B+', min: 61, max: 70 },
  { grade: 'B', min: 55, max: 60 },
  { grade: 'C', min: 51, max: 54 },
  { grade: 'Pass', min: 50, max: 50 },
];

/**
 * Calculates the converted external mark (out of 40)
 * @param {number} externalMarks - Marks out of 75
 * @returns {number} Converted marks out of 40
 */
const convertExternalTo40 = (externalMarks) => {
  // Formula: (external_marks / 75) * 40
  return (externalMarks / 75) * 40;
};

/**
 * Determines the grade based on total marks (out of 100)
 * @param {number} totalMarks - Marks out of 100
 * @returns {string} The corresponding grade
 */
const getGrade = (totalMarks) => {
  for (const item of GRADE_MIN_MARKS) {
    if (totalMarks >= item.min) {
      return item.grade;
    }
  }
  return 'Fail'; // Below 50 is fail
};

/**
 * Calculates the required external marks (out of 75) for a target grade
 * @param {number} internal - Internal marks out of 60
 * @param {number} targetTotal - The minimum total marks (out of 100) for the grade
 * @returns {number} Required external marks out of 75, or -1 if impossible
 */
const calculateExternalNeeded = (internal, targetTotal) => {
  // Formula: external_needed = ((target_total - internal) / 40) * 75
  const needed_for_40 = targetTotal - internal;
  if (needed_for_40 <= 0) {
    // Already guaranteed the grade or better
    return 0;
  }
  const external_needed = (needed_for_40 / 40) * 75;
  return external_needed;
};


// --- 2. React Component ---
const GradePredictor = () => {
  const [internalMarks, setInternalMarks] = useState('');
  const [semExamMarks, setSemExamMarks] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const handleInternalChange = (e) => {
    clearError();
    const value = e.target.value;
    if (value === '') {
        setInternalMarks('');
        setPrediction(null);
        return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 60) {
      setInternalMarks(numValue);
      setPrediction(null);
    }
  };

  const handleSemExamChange = (e) => {
    clearError();
    const value = e.target.value;
    if (value === '') {
        setSemExamMarks('');
        return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 75) {
      setSemExamMarks(numValue);
      setPrediction(null);
    }
  };

  const calculatePredictions = () => {
    clearError();
    const internal = Number(internalMarks);
    
    if (isNaN(internal) || internal < 0 || internal > 60 || internalMarks === '') {
        setError('Please enter a valid Internal Marks value (0-60).');
        return;
    }

    // --- Reverse Prediction Logic (Goal → Needed Marks) ---
    const neededMarks = GRADE_MIN_MARKS.map((item) => {
      const { grade, min, max } = item;
      const requiredExternal = calculateExternalNeeded(internal, min);
      let neededText = '';
      
      const maxPossibleTotal = internal + convertExternalTo40(75);

      if (maxPossibleTotal < min && grade !== 'Pass') {
        neededText = 'Impossible to reach';
      } else if (requiredExternal <= 0) {
        const maxGrade = getGrade(maxPossibleTotal);
        neededText = `Guaranteed ${maxGrade} or better!`;
      } else {
        neededText = `≥ ${Math.ceil(requiredExternal)} marks`;
      }

      return { ...item, range: `${min}–${max}`, needed: neededText };
    }).filter(item => item.grade !== 'Pass');

    // Add Fail row
    const minPassMarks = 50;
    const requiredForPass = calculateExternalNeeded(internal, minPassMarks);
    neededMarks.push({
        grade: 'Fail',
        min: 0,
        max: 49,
        range: `< ${minPassMarks}`,
        needed: `Below ${Math.ceil(requiredForPass)} marks`,
    });


    // --- Direct Prediction Logic (Internal + Sem Exam) ---
    let directPrediction = null;
    const semExam = Number(semExamMarks);

    if (!isNaN(semExam) && semExam >= 0 && semExam <= 75 && semExamMarks !== '') {
      const externalConverted = convertExternalTo40(semExam);
      const total = internal + externalConverted;
      const grade = getGrade(total);

      directPrediction = {
        total: total.toFixed(2),
        grade: grade,
        externalConverted: externalConverted.toFixed(2),
        semExam: semExam,
      };
    }

    setPrediction({
      internal: internal,
      neededMarks: neededMarks,
      directPrediction: directPrediction,
    });
  };

  // --- 3. Simple Styles (Minimal CSS for functionality) ---
  const styles = {
    container: { padding: '20px', maxWidth: '600px', margin: '30px auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' },
    header: { textAlign: 'center', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '20px' },
    inputGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' },
    button: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', marginBottom: '20px' },
    outputBox: { marginTop: '20px', padding: '15px', border: '1px solid #007bff', borderRadius: '4px', backgroundColor: '#f8f9fa' },
    outputHeader: { color: '#007bff', marginBottom: '10px', textAlign: 'center' },
    subHeader: { marginTop: '15px', marginBottom: '5px', borderBottom: '1px dotted #ccc', paddingBottom: '3px', color: '#555' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: 'white' },
    th: { border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#e9ecef' },
    td: { border: '1px solid #ddd', padding: '8px' },
    error: { padding: '10px', backgroundColor: '#fdd', border: '1px solid #f00', borderRadius: '4px', marginBottom: '15px', color: '#f00' },
    resultText: { margin: '5px 0', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🎓 Grade Prediction Calculator</h2>
      
      {/* --- Error Message --- */}
      {error && <div style={styles.error}>{error}</div>}

      {/* --- Input Section --- */}
      <div style={styles.inputGroup}>
        <label htmlFor="internal">Enter Internal Marks (out of 60):</label>
        <input
          id="internal"
          type="number"
          value={internalMarks}
          onChange={handleInternalChange}
          placeholder="e.g., 55"
          min="0"
          max="60"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="semExam">Optional: Enter Expected Sem Exam Marks (out of 75):</label>
        <input
          id="semExam"
          type="number"
          value={semExamMarks}
          onChange={handleSemExamChange}
          placeholder="e.g., 61"
          min="0"
          max="75"
          style={styles.input}
        />
      </div>

      <button onClick={calculatePredictions} style={styles.button}>
        CALCULATE GRADE PREDICTION
      </button>

      {/* --- Output Section --- */}
      {prediction && (
        <div style={styles.outputBox}>
          <h3 style={styles.outputHeader}>Results for Internal Marks: **{prediction.internal}/60**</h3>

          {/* --- Direct Prediction Result (If Sem Exam is entered) --- */}
          {prediction.directPrediction && (
            <>
              <h4 style={styles.subHeader}>Predicted Result for {prediction.directPrediction.semExam}/75 in Sem Exam:</h4>
              <p style={styles.resultText}>
                External Converted Mark (out of 40): **{prediction.directPrediction.externalConverted}**
              </p>
              <p style={styles.resultText}>
                Overall Total Mark (out of 100): **{prediction.directPrediction.total}**
              </p>
              <p style={{ ...styles.resultText, fontSize: '1.4em', color: '#007bff' }}>
                Predicted Grade: **{prediction.directPrediction.grade}**
              </p>
            </>
          )}

          {/* --- Required Marks Table --- */}
          <h4 style={styles.subHeader}>Required Semester Exam Marks (out of 75):</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Grade</th>
                <th style={styles.th}>Min Total (100)</th>
                <th style={styles.th}>Marks Needed (75)</th>
              </tr>
            </thead>
            <tbody>
              {prediction.neededMarks.map((item) => (
                <tr key={item.grade}>
                  <td style={styles.td}>**{item.grade}**</td>
                  <td style={styles.td}>**{item.range}**</td>
                  <td style={{ ...styles.td, fontWeight: 'bold', color: item.grade === 'Fail' ? 'red' : 'green' }}>{item.needed}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default GradePredictor;