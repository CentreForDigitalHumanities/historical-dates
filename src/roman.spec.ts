import { Calendar } from './calendar';
import { createDate } from './common';
import { InvalidDateException } from './invalid-date-exception';
import { RomanDay, RomanText, RomanMonth, RomanDate, RomanDayLong } from './roman';

describe('Roman', () => {
    it('Converts Roman dates', () => {
        expectRoman(5, 6, 2018, '', 'Non.', 'Jun.', 'MMXVIII');
        expectRoman(8, 9, 2017, 'a.d.VI.', 'Id.', 'Sept.', 'MMXVII');
        expectRoman(27, 2, 1987, 'a.d.III.', 'Kal.', 'Mart.', 'MCMLXXXVII');
        expectRoman(10, 12, 1815, 'a.d.IV.', 'Id.', 'Dec.', 'MDCCCXV');
        expectRoman(17, 5, 1792, 'a.d.XVI.', 'Kal.', 'Jun.', 'MDCCXCII');
        expectRoman(18, 3, 1634, 'a.d.XV.', 'Kal.', 'Apr.', 'MDCXXXIV');
        // wrap-around of last days of December to January:
        expectRoman(21, 12, 1401, 'a.d.XII.', 'Kal.', 'Ian.', 'MCDI');
        // leap year in 1600
        expectRoman(29, 2, 1600, 'pr.', 'Kal.', 'Mart.', 'MDC');
    });

    it('Converts and reverts all dates', () => {
        let action = (year: number, month: number, day: number, calendar: Calendar) => {
            let roman: RomanDate | null = null;
            try {
                roman = null;
                roman = RomanDate.fromDate(createDate(year, month, day, calendar));
                let back = roman.toDate();

                let fromString = `${day}-${month}-${year}`;
                let backString = `${back.day}-${back.month}-${back.year}`;

                if (fromString != backString) {
                    fail(`${fromString} != ${backString} (${roman})`);
                }
            } catch (error) {
                if (roman != null) {
                    console.log(roman.toString());
                }
                throw error;
            }
        };

        allDates('gregorian', action);
        allDates('julian', action);
    });

    it('Parses string', () => {
        expectRomanParse('a.d.XV. Kal. Apr. MDCXXXIV', 'a.d.XV.', 'Kal.', 'Apr.', 'MDCXXXIV');
        expectRomanParse('ad.xv.cal. apr  MDCXXXIV', 'a.d.XV.', 'Kal.', 'Apr.', 'MDCXXXIV');
        expectRomanParse('prid Kal. mar MDC', 'pr.', 'Kal.', 'Mart.', 'MDC');
        expectRomanParse('a.d. IV. eid. dec md cccxv ', 'a.d.IV.', 'Id.', 'Dec.', 'MDCCCXV');
        expectRomanParse('postr nonis. okt m cccxv ', 'postr.', 'Non.', 'Oct.', 'MCCCXV');;
        expectRomanParse('pridie kalendas nov mdccc xv ', 'pr.', 'Kal.', 'Nov.', 'MDCCCXV');
    });

    it('Converts to and from string', () => {
        let action = (year: number, month: number, day: number, calendar: Calendar) => {
            let romanDate = RomanDate.fromDate(createDate(year, month, day, calendar));
            let text = romanDate.toString();
            expect(text).toEqual(RomanDate.fromString(text, calendar).toString());
        };
        allDates('gregorian', action, 131);
        allDates('julian', action, 131);
    });

    function allDates(calendar: Calendar,
        action: (year: number, month: number, day: number, calendar: Calendar) => void,
        speedup = 1) {
        let today = new Date();
        let date = new Date(1400, 1, 1);
        while (date < today) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            try {
                action(year, month, day, calendar);
            } catch (error) {
                console.log(`${day}-${month}-${year}`);
                console.log(error);
                throw error;
            }

            let next = date.getDate() + speedup;
            date.setDate(next);
        }
    }

    function getExpectedString(romanDay: RomanDay,
        romanText: RomanText,
        romanMonth: RomanMonth,
        romanYear: string) {
        return [
            ...(romanDay ? [RomanDayLong[romanDay] || romanDay] : []),
            romanText,
            romanMonth,
            romanYear].join(' ');
    }

    function expectRomanParse(string: string,
        romanDay: RomanDay,
        romanText: RomanText,
        romanMonth: RomanMonth,
        romanYear: string) {
        try {
            let expected = getExpectedString(romanDay, romanText, romanMonth, romanYear);
            let parsed = RomanDate.fromString(string, 'julian');
            expect(parsed.toString()).toEqual(expected);

            parsed = RomanDate.fromString(string, 'gregorian');
            expect(parsed.toString()).toEqual(expected);
        } catch (error) {
            if (error instanceof InvalidDateException) {
                console.error(error.message);
            }
            throw error;
        }
    }

    function expectRoman(day: number,
        month: number,
        year: number,
        romanDay: RomanDay,
        romanText: RomanText,
        romanMonth: RomanMonth,
        romanYear: string) {
        let expected = getExpectedString(romanDay, romanText, romanMonth, romanYear);

        expect(RomanDate.fromDate(createDate(year, month, day)).toString()).toEqual(expected);
        let from = new RomanDate(
            romanDay,
            romanText,
            romanMonth,
            romanYear).toDate();
        expect(`${from.day}-${from.month}-${from.year}`)
            .toEqual(`${day}-${month}-${year}`);
    }
});
