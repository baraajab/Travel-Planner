const { getRdays } = require("../script/getRdays");

const now = new Date();

test('give me the remaining days from now to the date i will set at the parameter', () => {
    expect(getRdays(now)).toBe(-0);
});
