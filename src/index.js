import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import AppRouter from './AppRouter';
import { UserProvider } from './context/store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <AppRouter>
        <App />
      </AppRouter>
    </UserProvider>
  </React.StrictMode>
);
