"use client";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { useContext } from "react";
import UserContext from "./UserContext";

export default function AppNavbar() {
  const { userData } = useContext(UserContext);
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/home">My app</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/learn">Learn</Nav.Link>
          <Nav.Link href="/talk">Talk</Nav.Link>
        </Nav>
        {userData ? (
          <Nav className="ms-auto d-flex align-items-center">
            <NavDropdown title={userData.name} id="userDropdown">
              <NavDropdown.Item href="/profile">
                Change profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => alert("Delete data clicked")}>
                Delete data
              </NavDropdown.Item>
            </NavDropdown>
            {userData.language && (
              <img
                src={`/flags/${userData.language[1]}.jpg`}
                alt={`${userData.language[1]} flag`}
                style={{ width: "40px", height: "25px" }}
              />
            )}
          </Nav>
        ) : (
          <Nav className="ms-auto">
            <Button variant="outline-primary" href="/">
              Select Profile
            </Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}
