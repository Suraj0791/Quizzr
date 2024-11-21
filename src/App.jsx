import React, { useEffect, useReducer,useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Progress from './components/Progress'
import Questions from './components/Questions';

function App() {
    
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
    <div className='app' >
            <Header/>
            <Progress id={id} />
            <Questions questions={questions} allOptions={allOptions} isLoading={isLoading} error={error} setId={setId} id={id} />
            <Footer/>
    </div>
  )
} 

export default App

