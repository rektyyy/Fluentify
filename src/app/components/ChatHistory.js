import { Container, Row, Col, Card } from "react-bootstrap";

export default function ChatHistory({ conversation }) {
  const containerStyle = {
    maxHeight: "90vh",
    overflowY: "auto",
  };
  return (
    <Container style={containerStyle}>
      {conversation.slice(1).map((item, index) => (
        <Row key={index} className="mb-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>
                  <strong>{item.role}:</strong> {item.content}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  );
}
