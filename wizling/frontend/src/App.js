import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlashcardGame from './components/FlashcardGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/en/card-study" element={<FlashcardGame />} />
      </Routes>
    </Router>
  );
}

export default App;
