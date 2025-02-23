const axios = require("axios");

async function fetchCityLocation(cityName, apiUsername) {
    if (!cityName || !apiUsername) {
        return {
            success: false,
            message: "City name and API username are required.",
        };
    }

    const apiUrl = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(cityName)}&maxRows=1&username=${apiUsername}`;

    try {
        const response = await axios.get(apiUrl);
        const locations = response.data.geonames;

        if (!locations || locations.length === 0) {
            return {
                success: false,
                message: "City not found. Please try a different name.",
            };
        }

        return {
            success: true,
            location: locations[0],
        };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred while fetching city data. Please try again later.",
            errorDetails: error.message,
        };
    }
}

module.exports = { fetchCityLocation };
