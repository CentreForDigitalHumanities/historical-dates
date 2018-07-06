import { calcEaster } from './easter';
import { Calendar } from './common';

describe('Easter', () => {
    it('Calculates Julian style correctly', () => {
        expectEaster(2012, 'julian', { day: 30, month: 1, year: 2012 });
        expectEaster(1400, 'julian', { day: 15, month: 2, year: 1400 });
    });

    it('Calculates Gregorian style correctly', () => {
        expectEaster(2012, 'gregorian', { day: 5, month: 2, year: 2012 });
        expectEaster(1400, 'gregorian', { day: 16, month: 2, year: 1400 });
    });

    function expectEaster(year: number,
        calendar: Calendar,
        septuagesima: { day: number, month: number, year: number }) {
        let actual = calcEaster(year, calendar).septuagesima;
        expect(`${actual.year}-${actual.month}-${actual.day}`).toEqual(
            `${septuagesima.year}-${septuagesima.month}-${septuagesima.day}`);
    }
});
