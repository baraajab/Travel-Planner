import axios from "axios";


const formElement = document.querySelector("form");
const cityInput = document.querySelector("#city");
const dateInput = document.querySelector("#flightDate");


const cityErrorElement = document.querySelector("#city_error");
const dateErrorElement = document.querySelector("#date_error");

const handleFormSubmit = async (event) => {
  event.preventDefault();
  console.log("Form submission triggered");


  if (!validateInputs()) {
    return;
  }

  try {

    const locationData = await fetchCityLocation();
    
    if (locationData?.error) {
      showError(cityErrorElement, locationData.message);
      return;
    }

    const { lng, lat, name } = locationData;
    const flightDate = dateInput.value;
    const remainingDays = calculateDaysDifference(flightDate);

 
    if (remainingDays < 0) {
      showError(dateErrorElement, "Date cannot be in the past");
      return;
    }

    
    const [weatherData, cityImage] = await Promise.all([
      fetchWeatherData(lng, lat, remainingDays),
      fetchCityImage(name),
    ]);


    updateUI(remainingDays, name, cityImage, weatherData);
  } catch (error) {
    console.error("Error handling form submission:", error);
    showError(cityErrorElement, "Something went wrong. Please try again.");
  }
};


const validateInputs = () => {
  clearErrors();
  
  if (!cityInput.value) {
    showError(cityErrorElement, "You need to enter the city");
    return false;
  }
  if (!dateInput.value) {
    showError(dateErrorElement, "Please enter the date");
    return false;
  }
  if (calculateDaysDifference(dateInput.value) < 0) {
    showError(dateErrorElement, "Date cannot be in the past");
    return false;
  }
  return true;
};


const fetchCityLocation = async () => {
  try {
    const response = await axios.post("http://localhost:8000/getCity", {
      city: cityInput.value,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch city location:", error);
    return { error: true, message: "Failed to retrieve city data" };
  }
};


const fetchWeatherData = async (longitude, latitude, daysAhead) => {
  try {
    const response = await axios.post("http://localhost:8000/getWeather", {
      lng: longitude,
      lat: latitude,
      remainingDays: daysAhead,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return { error: true, message: "Weather data unavailable" };
  }
};


const calculateDaysDifference = (targetDate) => {
  const today = new Date();
  const selectedDate = new Date(targetDate);
  const differenceInMs = selectedDate - today;
  return Math.ceil(differenceInMs / (1000 * 3600 * 24));
};


const fetchCityImage = async (cityName) => {
  try {
    const response = await axios.post("http://localhost:8000/getCityPic", {
      city_name: cityName,
    });
    return response.data.image;
  } catch (error) {
    console.error("Failed to fetch city image:", error);
    return null;
  }
};


const updateUI = (daysRemaining, city, image, weather) => {
  document.querySelector("#Rdays").innerHTML = `Your trip starts in ${daysRemaining} days from now`;
  document.querySelector(".cityName").innerHTML = `Location: ${city}`;
  document.querySelector(".weather").innerHTML = 
    daysRemaining > 7 ? `Weather is: ${weather.description}` : `Weather is expected to be: ${weather.description}`;
  document.querySelector(".temp").innerHTML = 
    daysRemaining > 7 ? `Forecast: ${weather.temp}°C` : `Temperature: ${weather.temp}°C`;
  document.querySelector(".max-temp").innerHTML = 
    daysRemaining > 7 ? `Max-Temp: ${weather.app_max_temp}°C` : "";
  document.querySelector(".min-temp").innerHTML = 
    daysRemaining > 7 ? `Min-Temp: ${weather.app_min_temp}°C` : "";

  document.querySelector(".cityPic").innerHTML = 
    image ? `<img src="${image}" alt="A view of ${city}">` : `<p>No image available</p>`;

  document.querySelector(".flight_data").style.display = "block";
};


const showError = (element, message) => {
  element.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${message}`;
  element.style.display = "block";
};


const clearErrors = () => {
  cityErrorElement.style.display = "none";
  dateErrorElement.style.display = "none";
};

export { handleFormSubmit };
