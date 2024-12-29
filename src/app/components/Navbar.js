"use client";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { useContext } from "react";
import UserContext from "./UserContext";
import Image from "next/image";

export default function AppNavbar() {
  const { userData } = useContext(UserContext);

  function handleDelete() {
    if (
      confirm("Are you sure you want to delete your data? THIS IS PERMANENT!")
    ) {
      fetch("/api/userData", {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/";
          }
        })
        .catch((error) => console.error("Error:", error));

      fetch("/api/treeData", {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/";
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }

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
              <NavDropdown.Item href="/">Change profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleDelete}>
                Delete data
              </NavDropdown.Item>
            </NavDropdown>
            <Image
              src={`/flags/${userData.language[1]}.jpg`} // Path to the flag image
              alt={`${userData.language[1]} flag`}
              width={40} // Set the desired width
              height={25} // Set the desired height
            />
          </Nav>
        ) : (
          <Nav className="ms-auto">
            <Button variant="outline-primary" href="/">
              Create profile
            </Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}
