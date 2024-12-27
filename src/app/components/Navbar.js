"use client";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useContext } from "react";
import UserContext from "./UserContext";

export default function AppNavbar() {
  const { userData } = useContext(UserContext);
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/">My app</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/learn">Learn</Nav.Link>
          <Nav.Link href="/talk">Talk</Nav.Link>
        </Nav>
        {userData && (
          <Nav className="ms-auto d-flex align-items-center">
            <span className="me-2">{userData.name}</span>
            {userData.language && (
              <img
                src={`/flags/${userData.language[1]}.jpg`}
                alt={`${userData.language} flag`}
                style={{ width: "40px", height: "25px" }}
              />
            )}
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}
