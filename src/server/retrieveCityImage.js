const axios = require("axios");

async function retrieveCityImage(cityName, apiKey) {
    if (!cityName || !apiKey) {
        return {
            success: false,
            message: "City name and API key are required.",
        };
    }

    try {
        const response = await axios.get(
            `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(cityName)}&image_type=photo`
        );
        const imageResults = response.data.hits;

        const imageUrl =
            imageResults.length > 0
                ? imageResults[0].webformatURL
                : "https://source.unsplash.com/random/640x480?city,morning,night&sig=1";

        return {
            success: true,
            imageUrl,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to retrieve city image.",
            errorDetails: error.message,
        };
    }
}

module.exports = { retrieveCityImage };
