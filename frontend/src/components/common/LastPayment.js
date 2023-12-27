import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import useData from "../../hooks/useData";

import { usePatchPayPayment } from "../../hooks/usePayments";

function LastPayment({ payment, fullHistory }) {
  const { username, isClient, isOwner, isAdmin, setPayments } = useData();
  const patchUserPayment = usePatchPayPayment();

  const handlePayPayment = async () => {
    const data = await patchUserPayment(username, payment.id, {
      byOwner: isOwner,
    });
    setPayments((prevPayments) =>
      prevPayments?.map((p) => (p.id === payment.id ? data : p))
    );
  };

  return (
    <div
      style={{ maxWidth: "40rem" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Card className="mx-4 py-2">
        {!fullHistory && <Card.Header>{payment.month}</Card.Header>}
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Status: </strong> {payment.status.replace(/_/g, " ")}
          </ListGroup.Item>
          {payment.client && isClient && (
            <ListGroup.Item>
              <strong>Owner: </strong> {payment.owner.username}
            </ListGroup.Item>
          )}

          {payment.owner && isOwner && (
            <ListGroup.Item>
              <strong>Tenant: </strong> {payment.client.username}
            </ListGroup.Item>
          )}

          {payment.period && (
            <ListGroup.Item>
              <strong>Period: </strong> {payment.period}
            </ListGroup.Item>
          )}

          {payment.rent && (
            <ListGroup.Item>
              <strong>Rent: </strong> {payment.rent}
            </ListGroup.Item>
          )}

          {payment.dueDate && (
            <>
              <ListGroup.Item>
                <strong>Due Date: </strong> {payment.dueDate}
              </ListGroup.Item>
              {payment.paidDate ? (
                <ListGroup.Item>
                  <strong>Paid Date: </strong> {payment.paidDate}
                </ListGroup.Item>
              ) : (
                <ListGroup.Item
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={handlePayPayment}
                >
                  {isOwner && <strong>CONFIRM PAYMENT </strong>}
                  {isClient && <strong>PAY </strong>}
                </ListGroup.Item>
              )}
            </>
          )}
        </ListGroup>
      </Card>
    </div>
  );
}

export default LastPayment;
