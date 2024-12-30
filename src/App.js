import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SaQuote from './Pages/SaQuote';
import Home from './Pages/Home';
import SaInvoice from './Pages/SaInvoice';
import SaDelivery from './Pages/SaDelivery';
import SaProforma from './Pages/SaProforma';
import Login from './Pages/Login';

function App() {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={ <Home />} 
          />
          <Route 
            path="/SaInvoice" 
            element= {<SaInvoice /> }
            />
          <Route 
            path="/SaProforma" 
            element= {<SaProforma /> }
            />
          <Route 
            path="/SaDelivery" 
            element= {<SaDelivery /> }
            />
          <Route 
            path="/SaQuote" 
            element= {<SaQuote /> }
            />
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;
