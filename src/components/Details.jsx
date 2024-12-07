import { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const Details = () => {
  const location = useLocation();
  const { city } = location.state;
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a6d92323cafb046462e30dd84a77c883&units=metric&lang=it`)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
      })
      .catch((e) => {
        console.log(e);
      });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a6d92323cafb046462e30dd84a77c883&units=metric&lang=it`)
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [city]);

  if (!weatherData || !forecastData) return <div>Caricamento...</div>;

  const { main, weather, wind, name } = weatherData;
  const { list } = forecastData;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: "short", day: "numeric", month: "short" };
    return date.toLocaleDateString("it-IT", options);
  };

  const groupForecastByDate = (forecastList) => {
    const forecastByDate = [];

    forecastList.forEach((forecast) => {
      const date = formatDate(forecast.dt);
      const existingDate = forecastByDate.find((item) => item.date === date);
      if (existingDate) {
        existingDate.forecasts.push(forecast);
      } else {
        forecastByDate.push({
          date: date,
          forecasts: [forecast],
        });
      }
    });

    return forecastByDate;
  };

  const groupedForecast = groupForecastByDate(list);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Container className="text-center">
      <h1 className="text-black fs-2">{name}</h1>

      <Card className="opacity-75 shadow-lg rounded-pill">
        <Card.Body>
          <Row>
            <Col xs={12}>
              <img src={`https://openweathermap.org/img/wn/${weather[0].icon}.png`} alt={weather[0].description} />
            </Col>
            <Col>
              <Card.Title>{weather[0].description}</Card.Title>
              <Card.Text>
                <strong>{Math.floor(main.temp)}°C</strong>
              </Card.Text>
              <Card.Text>Vento: {wind.speed} m/s</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Button className="mt-3" variant="warning" onClick={handleBack}>
        Torna alla Home
      </Button>

      <h3 className="mt-3 mb-3 text-black fs-4">Previsione per i prossimi 5 giorni</h3>
      <Row className="justify-content-between">
        {groupedForecast.slice(0, 5).map((forecastGroup, index) => {
          return (
            <Col key={index} xs={6} md={2}>
              <Card id="meteoCard" className="opacity-75 shadow-lg rounded-pill">
                <Card.Body>
                  <Card.Title>{forecastGroup.date}</Card.Title>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecastGroup.forecasts[0].weather[0].icon}.png`}
                    alt={forecastGroup.forecasts[0].weather[0].description}
                    width={50}
                  />
                  <Card.Text>{Math.floor(forecastGroup.forecasts[0].main.temp)}°C</Card.Text>
                  <Card.Text>{Math.floor(forecastGroup.forecasts[0].main.temp_min)}°C</Card.Text>
                  <Card.Text>{Math.floor(forecastGroup.forecasts[0].main.temp_max)}°C</Card.Text>
                  <Card.Text>Vento: {forecastGroup.forecasts[0].wind.speed} m/s</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Details;
