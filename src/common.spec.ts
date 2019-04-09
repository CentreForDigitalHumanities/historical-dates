import { createDate, parseDateString } from "./common";
import { JulianDate } from "./julian-date";
import { GregorianDate } from "./gregorian-date";

describe('Common', () => {
    it('Creates dates', () => {
        let gregorian = createDate(1987, 2, 27, 'gregorian');
        expect(gregorian).toBe(gregorian.toGregorian());
        expect(gregorian instanceof GregorianDate).toBeTruthy();

        let julian = createDate(1987, 2, 14, 'julian');
        expect(julian).toBe(julian.toJulian());
        expect(julian instanceof JulianDate).toBeTruthy();
    });

    it('Parses date strings', () => {
        expectDateParse('August 27, 1792', 27, 8, 1792);
        expectDateParse('Oct 15, 92', 15, 10, 92);
        expectDateParse('26 Dec. 1692', 26, 12, 1692);
        expectDateParse('XXVI Dec. M DCXCII', 26, 12, 1692);
    });

    function expectDateParse(text: string, day: number, month: number, year: number) {
        expect(parseDateString(text)).toEqual({ day, month, year });
    }
});