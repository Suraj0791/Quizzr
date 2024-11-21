import React, { useEffect, useReducer } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Progress from './components/Progress'
import Questions from './components/Questions';

function App() {
    
  

    

  return (
    <div className='app' >
            <Header/>
            <Progress/>
            <Questions/>
            <Footer/>
    </div>
  )
} 

export default App

