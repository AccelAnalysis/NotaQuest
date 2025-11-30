import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <AuthProvider>
        <Router>
          <AppRouter />
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
