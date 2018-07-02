import { calculate } from './easter';

describe('Easter', () => {
    it('Calculates Julian style correctly', () => {
        expect(calculate(2012, 'julian').DatSept).toEqual({ day: 30, month: 1, year: 2012 });
        expect(calculate(1400, 'julian').DatSept).toEqual({ day: 15, month: 2, year: 1400 });
    });

    it('Calculates Gregorian style correctly', () => {
        expect(calculate(2012, 'gregorian').DatSept).toEqual({ day: 5, month: 2, year: 2012 });
        expect(calculate(1400, 'gregorian').DatSept).toEqual({ day: 16, month: 2, year: 1400 });
    });
});
