import React, { useEffect, useState } from 'react';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(0);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadquestions(retries = 3) {
      if (!isMounted) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          'https://opentdb.com/api.php?amount=15&category=23&difficulty=medium&type=multiple',
          { signal: controller.signal }
        );

        if (!response.ok) {
          if (response.status === 429 && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return loadquestions(retries - 1);
          }
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        if (isMounted) {
          setQuestions(data.results);
          setIsLoading(false);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    }

    loadquestions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Empty dependency array since we only want to fetch once

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading questions...</div>;

  const allOptions = questions[id] ? 
    shuffleArray([
      questions[id].correct_answer,
      ...questions[id].incorrect_answers
    ]) : [];

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
                style={{
                  padding: '1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem',
                  textAlign: 'left',
                  ':hover': {
                    backgroundColor: '#e9ecef',
                    borderColor: '#dee2e6'
                  }
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
            onClick={() => setId((prevId) => (prevId + 1) % questions.length)}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              ':hover': {
                backgroundColor: '#0056b3'
              }
            }}
          >
            NEXT
          </button>
        </div>
      </div>
    );
  }

export default Questions;