const axios = require("axios");

async function fetchWeatherData(longitude, latitude, daysAhead, apiKey) {

    if (daysAhead < 0) {
        return {
            success: false,
            message: "Invalid date: Cannot retrieve past weather data.",
        };
    }

    try {
        let weatherResponse;
        let weatherInfo;

        if (daysAhead > 0 && daysAhead <= 7) {

            weatherResponse = await axios.get(
                `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&units=M&key=${apiKey}`
            );
            const latestData = weatherResponse.data.data.slice(-1)[0];
            weatherInfo = {
                description: latestData.weather.description,
                temperature: latestData.temp,
            };
        } else {

            weatherResponse = await axios.get(
                `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&units=M&days=${daysAhead}&key=${apiKey}`
            );
            const latestForecast = weatherResponse.data.data.slice(-1)[0];
            weatherInfo = {
                description: latestForecast.weather.description,
                temperature: latestForecast.temp,
                maxTemperature: latestForecast.app_max_temp,
                minTemperature: latestForecast.app_min_temp,
            };
        }

        return {
            success: true,
            data: weatherInfo,
        };
    } catch (error) {
        return {
            success: false,
            message: "Weather data retrieval failed.",
            errorDetails: error.message,
        };
    }
}

module.exports = { fetchWeatherData };
