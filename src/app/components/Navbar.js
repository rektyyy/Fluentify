"use client";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function AppNavbar() {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/">My App</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/learn">Learn</Nav.Link>
          <Nav.Link href="/talk">Talk</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
