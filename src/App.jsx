import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePoster from './pages/CreatePoster';
import PosterView from './pages/PosterView';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CreatePoster />} />
          <Route path="/p/:id" element={<PosterView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
