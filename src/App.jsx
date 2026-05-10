import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePoster from './pages/CreatePoster';
import PosterView from './pages/PosterView';

function FloatingHearts() {
  const hearts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${10 + Math.random() * 10}s`,
    fontSize: `${16 + Math.random() * 24}px`
  }));

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {hearts.map(heart => (
        <div 
          key={heart.id} 
          className="floating-heart"
          style={{
            left: heart.left,
            animationDelay: heart.animationDelay,
            animationDuration: heart.animationDuration,
            fontSize: heart.fontSize
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
        <FloatingHearts />
        <Routes>
          <Route path="/" element={<CreatePoster />} />
          <Route path="/p/:id" element={<PosterView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
