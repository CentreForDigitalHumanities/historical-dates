import { createDate } from "./common";

describe('Gregorian dates', () => {
    it('Converts dates to Julian as expected', () => {
        // Start of the Gregorian calendar
        expectJulian(5, 10, 1582, 15, 10, 1582);
        // Battle of the Boyne
        expectJulian(1, 7, 1690, 11, 7, 1690);
        // Birthday George Washington
        expectJulian(11, 2, 1732, 22, 2, 1732);
        // Russian October Revolution
        expectJulian(25, 10, 1917, 7, 11, 1917);
    });

    it('Converts to Julian dates and back', () => {
        let date = new Date(1582, 10, 15);
        let today = new Date();
        while (date < today) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            try {
                let gregorian = createDate(year, month, day, 'gregorian');
                let julian = gregorian.toJulian();
                let back = julian.toGregorian();
                expect(gregorian.toString()).toEqual(back.toString());
            } catch (error) {
                console.log(`${day}-${month}-${year}`);
                console.log(error);
                throw error;
            }

            let next = date.getDate() + 1;
            date.setDate(next);
        }
    });

    function expectJulian(julianDay: number, julianMonth: number, julianYear: number,
        gregorianDay: number, gregorianMonth: number, gregorianYear: number) {
        let converted = createDate(gregorianYear, gregorianMonth, gregorianDay, 'gregorian').toJulian();
        expect({
            year: converted.year,
            month: converted.month,
            day: converted.day
        }).toEqual({
            year: julianYear,
            month: julianMonth,
            day: julianDay
        });
    }
});
