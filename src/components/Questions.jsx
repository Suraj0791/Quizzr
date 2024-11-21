import React, { useState, useEffect } from 'react';

function Questions({ allOptions, error, id, isLoading, setId, questions }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hasClicked, setHasClicked] = useState(false);

  const handleOptionClick = (option) => {
    if (hasClicked) return; // Prevent multiple clicks
    setSelectedOption(option);
    setIsCorrect(option === questions[id].correct_answer);
    setHasClicked(true);
  };

  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setHasClicked(false);
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading questions...</div>;

  return (
    <div className="quiz-container" style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '10px',
      backgroundColor: '#fff'
    }}>
      <div className="question-section" style={{
        marginBottom: '2rem',
        padding: '20px'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          color: '#333',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>{questions[id]?.question}</h1>

        <div className="options-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginTop: '20px'
        }}>
          {allOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: hasClicked
                  ? (option === questions[id].correct_answer ? 'green' : (option === selectedOption ? 'red' : '#f8f9fa'))
                  : '#f8f9fa',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '1rem',
                color: hasClicked && option === selectedOption ? '#fff' : '#000',
                textAlign: 'left',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderTop: '1px solid #dee2e6'
      }}>
        <div className="timer" style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#6c757d'
        }}>
          TIMER
        </div>
        <button 
          onClick={() => {
            setId((prevId) => (prevId + 1) % questions.length);
            setSelectedOption(null);
            setIsCorrect(null);
            setHasClicked(false);
          }}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

export default Questions;