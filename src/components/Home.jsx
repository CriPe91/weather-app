import { useState } from "react";
import { Form, Button, InputGroup, FormControl, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const fetchWeather = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a6d92323cafb046462e30dd84a77c883&units=metric&lang=it`)
      .then((response) => response.json())
      .then((cityWeather) => {
        if (cityWeather.cod === 200) {
          const { name } = cityWeather;
          navigate("/Details", { state: { city: name } });
        } else {
          alert("Città non trovata");
        }
      })
      .catch((err) => {
        console.log("Errore:", err);
        alert("Si è verificato un errore nella ricerca meteo.");
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <Container className="text-center mt-5">
      <img src="https://cdn-icons-png.flaticon.com/128/648/648198.png" />
      <h1 className="display-4 text-warning mt-4 mb-4 text-shadow">Weather App</h1>
      <Row className="justify-content-center mt-3">
        <Col xs={4} md={12}>
          <Form onSubmit={handleSearch}>
            <InputGroup className="mb-3">
              <FormControl className="opacity-75" type="text" placeholder="Inserisci la città" value={city} onChange={(e) => setCity(e.target.value)} />
              <Button variant="warning" type="submit">
                Cerca
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
