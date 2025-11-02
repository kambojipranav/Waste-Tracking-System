import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AddWasteCollection from './components/AddWasteCollection';
import WasteCollectionList from './components/WasteCollectionList';

function Navigation() {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🗑️ Smart Waste Collection System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active fw-bold' : ''}
            >
              ➕ Add Collection
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/records" 
              className={location.pathname === '/records' ? 'active fw-bold' : ''}
            >
              📊 View Records
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Container>
          <Routes>
            <Route path="/" element={<AddWasteCollection />} />
            <Route path="/records" element={<WasteCollectionList />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;