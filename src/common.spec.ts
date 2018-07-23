import { createDate } from "./common";
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
});