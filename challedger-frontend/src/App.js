import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChallengePage from './pages/ChallengePage';
import RecordPage from './pages/RecordPage';
import StatsPage from './pages/StatsPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;