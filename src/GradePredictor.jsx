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
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="page-header">🎯 Grade Prediction Engine</h2>

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

      <motion.div className="input-grid-2col course-list-card" // Using card style
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="input-wrapper">
          <FaClipboardCheck className="input-icon" />
          <input
            type="number" value={newInternalMarks}
            onChange={(e) => setNewInternalMarks(e.target.value)}
            placeholder="Enter Internal Marks (0-60)" min="0" max="60" 
            className="input input-with-icon"
          />
        </div>
        <motion.button
          onClick={addSubject} 
          className="add-button"
          style={{marginTop: 0}} // Override margin
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 0 15px #FF6600, 0 0 25px #FF6600' 
          }} 
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Subject
        </motion.button>
      </motion.div>

      <div style={{marginTop: '20px'}}>
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