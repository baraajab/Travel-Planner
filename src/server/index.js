const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();


app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

const { fetchCityLocation } = require("./getCityLoc");
const { fetchWeatherData } = require("./weatherTemp");
const { retrieveCityImage } = require("./getCityPic");


const PORT = 8000;


const userPrefix = process.env.USERNAME || "";
const userSuffix = process.env.USERNUMBER || "";
const WEATHER_API_KEY = process.env.WEATHER_KEY;
const PIXABAY_API_KEY = process.env.pixabay_key;
const GEO_NAMES_USERNAME = userPrefix + userSuffix;

app.get("/", (req, res) => {
    res.render("index.html");
});


app.post("/getCity", async (req, res) => {
    const { city } = req.body;
    const locationData = await fetchCityLocation(city, GEO_NAMES_USERNAME);
    res.send(locationData);
});


app.post("/getWeather", async (req, res) => {
    const { lng, lat, remainingDays } = req.body;
    const weatherInfo = await fetchWeatherData(lng, lat, remainingDays, WEATHER_API_KEY);
    res.send(weatherInfo);
});


app.post("/getCityPic", async (req, res) => {
    const { city_name } = req.body;
    const cityImage = await retrieveCityImage(city_name, PIXABAY_API_KEY);
    res.send(cityImage);
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
