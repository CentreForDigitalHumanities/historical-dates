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
        expectDateParse('June 27, 1727', 27, 6, 1727);
        expectDateParse('July 6th, 1727.', 6, 7, 1727);
        expectDateParse('October 9th 1665', 9, 10, 1665);
        expectDateParse('ce 8. Novembre 1624.', 8, 11, 1624);
        expectDateParse('19. de Mai, l\'an 1617', 19, 5, 1617);
        expectDateParse('le 10. de Iuin 1622.', 10, 6, 1622);
        expectDateParse('4.Nov. 1698', 4, 11, 1698);
        expectDateParse('9. Nov. 98', 9, 11, 98);
        expectDateParse('XI. Junii Anno MDCXXXVII.', 11, 6, 1637);
        expectDateParse('XXVII. Decembr. Anno MDCXXXVII.', 27, 12, 1637);
        expectDateParse('Sept. 20. 1692.', 20, 9, 1692);
        expectDateParse('le 12. Aoust. 1659.', 12, 8, 1659);
        expectDateParse('XXIII. Novembr. A.C. MDCXXXVII.', 23, 11, 1637);
        expectDateParse('XVII Aug. A. MDLXV.', 17, 8, 1565);
    });

    function expectDateParse(text: string, day: number, month: number, year: number) {
        expect(parseDateString(text)).toEqual({ day, month, year });
    }
});