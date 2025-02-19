const getRdays = (date) => {
    // set the start and end date
    const now = new Date();
    const travelDate = new Date(date);

    const timeDifference = travelDate.getTime() - now.getTime();
    const Rdays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // return the remaining days
    return Rdays;
};

export { getRdays };
