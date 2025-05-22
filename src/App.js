import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Quiz1 from './components/Quiz1';
import Quiz2 from './components/Quiz2';
import Quiz3 from './components/Quiz3';
import Quiz4 from './components/Quiz4';
import Quiz5 from './components/Quiz5';
import Leaderboard from './components/Leaderboard';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AdminPanel from './components/Admin';
import AchievementsList from './components/AchievementsList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz1" element={<Quiz1 />} />
        <Route path="/quiz2" element={<Quiz2 />} />
        <Route path="/quiz3" element={<Quiz3 />} />
        <Route path="/quiz4" element={<Quiz4 />} />
        <Route path="/quiz5" element={<Quiz5 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/achievements" element={<AchievementsList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route 
    path="/admin" 
    element={
        localStorage.getItem('admin') === 'true' 
            && <AdminPanel /> 
    } 
/>
      </Routes>
    </Router>
  );
}

export default App; 