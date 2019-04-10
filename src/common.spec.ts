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
        expectDateParse('ce 14. Aoust 1635', 14, 8, 1635);
        expectDateParse('XXVI Dec M DCXCII', 26, 12, 1692);
        expectDateParse('XXV Nov. M DCXCI', 25, 11, 1691);
        expectDateParse('19. d\'Avril 1619.', 19, 4, 1619);
        expectDateParse('VI. Maji Anno MDCXXXIV.', 6, 5, 1634);
        expectDateParse('20.Jun.Ao.1639', 20, 6, 1639);
        expectDateParse('à 24. de Septiembre del an̄o de 1591.', 24, 9, 1591);
    });

    function expectDateParse(text: string, day: number, month: number, year: number) {
        expect(parseDateString(text)).toEqual({ day, month, year });
    }
});