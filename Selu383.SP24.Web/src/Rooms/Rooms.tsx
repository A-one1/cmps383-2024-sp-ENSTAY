import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

interface Hotel {
  id: number;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;

  // Add more fields as needed
}

const Rooms: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed in JavaScript
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const initialHotels: Hotel = location.state ? location.state.hotel : [];
  const checkInDate = location.state
    ? formatDate(location.state.checkInDate)
    : "";
  const checkOutDate = location.state
    ? formatDate(location.state.checkOutDate)
    : "";

  const [hotel] = useState<Hotel>(initialHotels);
  console.log("🚀 ~ hotel:", hotel.id);
  const [rooms, setRooms] = useState<any[]>([]);

  const getRooms = async (
    hotelId: number,
    checkInDate: string,
    checkOutDate: string
  ) => {
    const response = await fetch(
      `/api/reservations/availableRooms/${hotelId}/${checkInDate}/${checkOutDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const roomData = await response.json();
    setRooms(roomData);
    console.log("🚀 ~ getRooms ~ roomData:", roomData);
  };

  useEffect(() => {
    getRooms(hotel.id, checkInDate, checkOutDate);
  }, []);

  const handleViewRooms = (hotel: Hotel) => {
    navigate("/reservations/rooms", {
      state: { hotel, checkInDate, checkOutDate },
    });
  };

  return (
    <Container>
      <h1>Rooms</h1>

      <Row>
        <Col>{/* <p>{hotels.length} Hotels Found</p> */}</Col>
      </Row>
      {rooms.map((room, index) => (
        <Col key={index} xs={12}>
          <Card className="mb-3" style={{ maxWidth: "100%" }}>
            <Row className="g-0">
              <Col md={3}>
                <Card.Img
                  variant="top"
                  src="https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM="
                />{" "}
                {/* Replace with your image source */}
              </Col>
              <Col md={9}>
                <Card.Body style={{ fontFamily: "sans-serif" }}>
                  <Card.Title style={{ fontSize: "30px", fontWeight: "700" }}>
                    Room {room.number}
                  </Card.Title>
                  <Card.Text>
                    <strong>Description:</strong> {room.description}
                    <br />
                    <strong>Capacity:</strong> {room.capacity} people
                    <br />
                    <strong>Price:</strong> ${room.price} per night
                    <br />
                    <strong> Premium:</strong> {room.isPremium ? "Yes" : "No"}
                    <br />
                  </Card.Text>
                  {/* Add more fields as needed */}
                  {/* <Card.Text>
                    <small className="text-muted">
                      Last updated 3 mins ago
                    </small>
                  </Card.Text> */}
                  <hr />
                  <button
                    type="button"
                    className="btn btn-success"
                    style={{ marginLeft: "70%" }}
                    onClick={() => handleViewRooms(room)}
                  >
                    Book Now
                  </button>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      ))}
    </Container>
  );
};

export default Rooms;
