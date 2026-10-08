import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UiProvider } from './context/UiContext';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UiProvider><AuthProvider><ShopProvider><App /></ShopProvider></AuthProvider></UiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
