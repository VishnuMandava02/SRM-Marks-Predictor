import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaClipboardCheck 
} from 'react-icons/fa';
import SubjectCard from './SubjectCard'; 

const GradePredictor = () => {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('gradePredictor.subjects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newInternalMarks, setNewInternalMarks] = useState('');
  const [error, setError] = useState(null);

  React.useEffect(() => {
    localStorage.setItem('gradePredictor.subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    setError(null);
    const internal = Number(newInternalMarks);
    
    if (isNaN(internal) || internal < 0 || internal > 60 || newInternalMarks === '') {
      setError('Please enter valid internal marks (0-60).');
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: `Subject ${subjects.length + 1}`, 
      internal: internal,
    };
    
    setSubjects([...subjects, newSubject]);
    setNewInternalMarks('');
  };

  const deleteSubject = (id) => {
    const newSubjects = subjects
      .filter(subject => subject.id !== id)
      .map((subject, index) => ({
        ...subject,
        name: `Subject ${index + 1}`
      }));
    setSubjects(newSubjects);
  };
  
  const styles = {
    header: {
      fontSize: '2.5em', fontWeight: 'bold', color: '#ffffff',
      marginBottom: '30px', borderBottom: '2px solid #FF6600',
      paddingBottom: '10px', textShadow: '0 0 5px #FF6600',
    },
    inputGrid: {
      display: 'grid', gridTemplateColumns: '2fr 1fr',
      gap: '20px',
      marginBottom: '30px', padding: '25px', backgroundColor: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(10px)', borderRadius: '10px', border: '1px solid rgba(255, 102, 0, 0.2)',
    },
    inputWrapper: { position: 'relative' },
    inputIcon: {
      position: 'absolute', top: '50%', left: '15px',
      transform: 'translateY(-50%)', color: '#FF6600',
    },
    input: {
      width: '100%', padding: '15px 15px 15px 45px', boxSizing: 'border-box',
      border: '1px solid #2E1A00', borderRadius: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#ffffff', fontSize: '1em',
    },
    addButton: {
      padding: '15px', backgroundColor: '#FF6600', color: '#000000',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1em',
      fontWeight: 'bold', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '10px',
    },
    error: {
      padding: '15px', backgroundColor: 'rgba(255, 50, 50, 0.2)', border: '1px solid #ff3232',
      borderRadius: '8px', marginBottom: '20px', color: '#ffadad',
      textAlign: 'center', fontWeight: 'bold',
    },
    subjectListContainer: {
      marginTop: '20px',
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={styles.header}>🎯 Grade Prediction Engine</h2>

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

      <motion.div style={styles.inputGrid}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={styles.inputWrapper}>
          <FaClipboardCheck style={styles.inputIcon} />
          <input
            type="number" value={newInternalMarks}
            onChange={(e) => setNewInternalMarks(e.target.value)}
            placeholder="Enter Internal Marks (0-60)" min="0" max="60" style={styles.input}
          />
        </div>
        <motion.button
          onClick={addSubject} style={styles.addButton}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 0 15px #FF6600, 0 0 25px #FF6600' 
          }} 
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Subject
        </motion.button>
      </motion.div>

      <div style={styles.subjectListContainer}>
        <AnimatePresence>
          {subjects.map(subject => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              onDelete={deleteSubject}
            />
          ))}
        </AnimatePresence>
      </div>
      
    </motion.div>
  );
};

export default GradePredictor;