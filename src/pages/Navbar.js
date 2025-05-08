import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Navbar as BootstrapNavbar,
  Nav,
  NavDropdown,
  Button
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from './img3.png';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const closeMenu = () => setExpanded(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole(null);
    navigate('/login');
  };

  return (
    <BootstrapNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={expanded}
      className="shadow-sm py-3"
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img
            src={logo}
            width="36"
            height="36"
            className="d-inline-block align-top"
            alt="VolunteerHub Logo"
          />
          <span className="fw-semibold fs-5">VolunteerHub</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
              onClick={closeMenu}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/faq"
              active={location.pathname === '/faq'}
              onClick={closeMenu}
            >
              FAQ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/events"
              active={location.pathname === '/events'}
              onClick={closeMenu}
            >
              Upcoming Events
            </Nav.Link>

            {role === 'volunteer' && (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  active={location.pathname === '/dashboard'}
                  onClick={closeMenu}
                >
                  Dashboard
                </Nav.Link>

                <NavDropdown title="Events" id="events-dropdown" menuVariant="dark">
                  <NavDropdown.Item
                    as={Link}
                    to="/events/upcoming"
                    onClick={closeMenu}
                  >
                    Upcoming
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/events/past"
                    onClick={closeMenu}
                  >
                    Past Events
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {role === 'organizer' && (
              <>
                <Nav.Link
                  as={Link}
                  to="/admin-dashboard"
                  active={location.pathname === '/admin-dashboard'}
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/donation"
                  active={location.pathname === '/donation'}
                  onClick={closeMenu}
                >
                  Donate
                </Nav.Link>
              </>
            )}
          </Nav>

          <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">
            {role ? (
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="me-2"
                  onClick={closeMenu}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  onClick={closeMenu}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
