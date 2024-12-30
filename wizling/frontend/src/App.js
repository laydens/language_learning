import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VocabDetailView from './components/VocabDetail/VocabDetailView';
import KanjiDetailView from './components/KanjiDetail/KanjiDetailView';
import FlashcardGame from './components/FlashcardGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/vocab/:id" element={<VocabDetailView />} />
        <Route path="/kanji/:id" element={<KanjiDetailView />} />
        <Route path="/flashcards" element={<FlashcardGame />} />
        <Route path="/card-study" element={<FlashcardGame />} />
        <Route path="/" element={<FlashcardGame />} />
      </Routes>
    </Router>
  );
}

export default App;
