import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewTask from './pages/NewTask';
import Login from './pages/Login';
import ForgotPassWord from './pages/ForgotPassWord';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import UserProfile from './pages/UserProfile';
import TaskPage from './pages/TaskPage';
import AnalyticsPage from './pages/AnalyticsPage';
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem('token', token);
          setCurrentUser(user);
        });
      } else {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {/* Remove Navbar from here */}
      {/* <Navbar currentUser={currentUser} /> */}
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route path="/home" element={<HomePage currentUser={currentUser} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/forgotpassword" element={<ForgotPassWord />} />
        <Route path="/taskpage" element={<TaskPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-task"
          element={
            <ProtectedRoute>
              <NewTask />
            </ProtectedRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;