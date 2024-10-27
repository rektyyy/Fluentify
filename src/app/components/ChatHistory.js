import { Container, Row, Col, Card } from "react-bootstrap";

export default function ChatHistory({ conversation }) {
  return (
    <Container>
      {conversation.slice(4).map((item, index) => (
        <Row key={index} className="mb-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>
                  <strong>{item.sender}:</strong> {item.message}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  );
}
