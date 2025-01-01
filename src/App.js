import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import SaHome from './Pages/SaHome';
import MiHome from './Pages/MiHome';
import SaInvoice from './Pages/SaInvoice';
import SaDelivery from './Pages/SaDelivery';
import SaProforma from './Pages/SaProforma';
import SaQuote from './Pages/SaQuote';
import MiInvoice from './Pages/MiInvoice';
import MiDelivery from './Pages/MiDelivery';
import MiProforma from './Pages/MiProforma';
import MiQuote from './Pages/MiQuote';

import Login from './Pages/Login';

function App() {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  return (
    <div className="App">
      <Router>
        <Routes>
          
          <Route 
            path="/" 
            element={ <Home />} 
          />
          <Route 
            path="/SaHome" 
            element={ <SaHome />} 
          />
          <Route 
            path="/MiHome" 
            element={ <MiHome />} 
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
          <Route 
            path="/MiInvoice" 
            element= {<MiInvoice /> }
            />
          <Route 
            path="/MiProforma" 
            element= {<MiProforma /> }
            />
          <Route 
            path="/MiDelivery" 
            element= {<MiDelivery /> }
            />
          <Route 
            path="/MiQuote" 
            element= {<MiQuote /> }
            />
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;
