/**
 * Derived from http://cgi.axel-findling.de/cgi-bin/romdat
 * Originally written by Axel Findling.
 * Modified by Sheean Spoel, Digital Humanities Lab, Utrecht University.
 */
import { Calendar } from './calendar';
import { isLeapYear, createDate } from './common';
import { InvalidDateException } from './invalid-date-exception';
import { HistoricalDate } from './historical-date';

export const RomanMonths = {
    "Ian.": 1,
    "Feb.": 2,
    "Mart.": 3,
    "Apr.": 4,
    "Mai.": 5,
    "Jun.": 6,
    "Jul.": 7,
    "Sext.": 8,
    "Sept.": 9,
    "Oct.": 10,
    "Nov.": 11,
    "Dec.": 12
};
export const RomanDays = {
    "": 1,
    "pr.": 2,
    "a.d.III.": 3,
    "a.d.IV.": 4,
    "a.d.V.": 5,
    "a.d.VI.": 6,
    "a.d.VII.": 7,
    "a.d.VIII.": 8,
    "a.d.IX.": 9,
    "a.d.X.": 10,
    "a.d.XI.": 11,
    "a.d.XII.": 12,
    "a.d.XIII.": 13,
    "a.d.XIV.": 14,
    "a.d.XV.": 15,
    "a.d.XVI.": 16,
    "a.d.XVII.": 17,
    "a.d.XVIII.": 18,
    "a.d.XIX.": 19
};
export const RomanTexts = { "Kal.": 1, "Non.": 2, "Id.": 3 };

const RomanMonthPatterns: [RegExp, RomanMonth][] = [
    [/^[ij]an\.?/i, 'Ian.'],
    [/^feb\.?/i, 'Feb.'],
    [/^mart?\.?/i, 'Mart.'],
    [/^apr\.?/i, 'Apr.'],
    [/^ma[ij]\.?/i, 'Mai.'],
    [/^[ij]un\.?/i, 'Jun.'],
    [/^[ij]ul\.?/i, 'Jul.'],
    [/^se[cxk]t?\.?/i, 'Sext.'],
    [/^sept?\.?/i, 'Sept.'],
    [/^o[ck]t\.?/i, 'Oct.'],
    [/^nov\.?/i, 'Nov.'],
    [/^de[ck]\.?/i, 'Dec.']];

const RomanDayPatterns: [RegExp, RomanDay][] = [
    [/^\.*/, ''],
    [/^pri?d?\.?/i, 'pr.'],
    [/^a\.?d\.? ?iii\.?/i, 'a.d.III.'],
    [/^a\.?d\.? ?iv\.?/i, 'a.d.IV.'],
    [/^a\.?d\.? ?v\.?/i, 'a.d.V.'],
    [/^a\.?d\.? ?vi\.?/i, 'a.d.VI.'],
    [/^a\.?d\.? ?vii\.?/i, 'a.d.VII.'],
    [/^a\.?d\.? ?viii\.?/i, 'a.d.VIII.'],
    [/^a\.?d\.? ?ix\.?/i, 'a.d.IX.'],
    [/^a\.?d\.? ?x\.?/i, 'a.d.X.'],
    [/^a\.?d\.? ?xi\.?/i, 'a.d.XI.'],
    [/^a\.?d\.? ?xii\.?/i, 'a.d.XII.'],
    [/^a\.?d\.? ?xiii\.?/i, 'a.d.XIII.'],
    [/^a\.?d\.? ?xiv\.?/i, 'a.d.XIV.'],
    [/^a\.?d\.? ?xv\.?/i, 'a.d.XV.'],
    [/^a\.?d\.? ?xvi\.?/i, 'a.d.XVI.'],
    [/^a\.?d\.? ?xvii\.?/i, 'a.d.XVII.'],
    [/^a\.?d\.? ?xviii\.?/i, 'a.d.XVIII.'],
    [/^a\.?d\.? ?xix\.?/i, 'a.d.XIX.']
];

const RomanTextPatterns: [RegExp, RomanText][] = [
    [/^[ck]al\.?/i, 'Kal.'],
    [/^non\.?/i, 'Non.'],
    [/^e?id\.?/i, 'Id.']
];

export type RomanMonth = keyof typeof RomanMonths;
export type RomanDay = keyof typeof RomanDays;
export type RomanText = keyof typeof RomanTexts;

function matchBiggest<T>(text: string, patterns: [RegExp, T][]) {
    let candidateText = '';
    let candidate: T | null = null;

    for (let [pattern, key] of patterns) {
        let match = text.match(pattern);
        if (match && match[0].length >= candidateText.length) {
            candidateText = match[0];
            candidate = key;
        }
    }

    return { text: candidate, length: candidateText.length };
}

export class RomanDate {
    constructor(public day: RomanDay,
        public text: RomanText,
        public month: RomanMonth,
        public year: string,
        public calendar: Calendar = 'gregorian') {
    }

    static fromDate(date: HistoricalDate) {
        let { romanDay, romanText, romanMonthName } = romanCalendar(date);
        let romanYear = toRomanNumber(date.year);

        return new RomanDate(romanDay, romanText, romanMonthName, romanYear, date.calendar);
    }

    static fromString(string: string, calendar: Calendar = 'gregorian') {
        let romanDay = matchBiggest(string, RomanDayPatterns);

        if (romanDay.text == null) {
            throw new InvalidDateException(`No day found in ${string}`);
        }

        let remainder = string.substring(romanDay.length).trimLeft();
        let romanText = matchBiggest(remainder, RomanTextPatterns);

        if (romanText.text == null) {
            throw new InvalidDateException(`No text part found in ${string} (${remainder}; ${romanDay.text})`);
        }

        remainder = remainder.substring(romanText.length).trimLeft();
        let romanMonth = matchBiggest(remainder, RomanMonthPatterns);

        if (romanMonth.text == null) {
            throw new InvalidDateException(`No month found in ${string} (${remainder})`);
        }

        let romanYear = remainder.substring(romanMonth.length).replace(/\s/g, '').toUpperCase();
        // normalize it and check validity
        romanYear = toRomanNumber(fromRomanNumber(romanYear));

        return new RomanDate(romanDay.text, romanText.text, romanMonth.text, romanYear, calendar);
    }

    toString() {
        return `${this.day}${this.text}${this.month} ${this.year}`;
    }

    toDate() {
        let year = this.year.replace(/[^MDCLXVI]/gi, '').toUpperCase();
        let germanYear = fromRomanNumber(year);
        let date = germanCalendar(
            RomanDays[this.day],
            RomanTexts[this.text],
            RomanMonths[this.month],
            germanYear,
            this.calendar);

        return createDate(germanYear, date.month, date.day, this.calendar);
    }
}

export function fromRomanNumber(value: string) {
    let index = 0;
    let result = 0;

    if (value.substr(index, 3) == "MMM") { result += 3000; index += 3; }
    else if (value.substr(index, 2) == "MM") { result += 2000; index += 2; }
    else if (value.substr(index, 1) == "M") { result += 1000; index += 1; }

    if (value.substr(index, 2) == "CM") { result += 900; index += 2; }
    else if (value.substr(index, 4) == "DCCC") { result += 800; index += 4; }
    else if (value.substr(index, 3) == "DCC") { result += 700; index += 3; }
    else if (value.substr(index, 2) == "DC") { result += 600; index += 2; }
    else if (value.substr(index, 1) == "D") { result += 500; index += 1; }
    else if (value.substr(index, 2) == "CD") { result += 400; index += 2; }
    else if (value.substr(index, 3) == "CCC") { result += 300; index += 3; }
    else if (value.substr(index, 2) == "CC") { result += 200; index += 2; }
    else if (value.substr(index, 1) == "C") { result += 100; index += 1; }

    if (value.substr(index, 2) == "XC") { result += 90; index += 2; }
    else if (value.substr(index, 4) == "LXXX") { result += 80; index += 4; }
    else if (value.substr(index, 3) == "LXX") { result += 70; index += 3; }
    else if (value.substr(index, 2) == "LX") { result += 60; index += 2; }
    else if (value.substr(index, 1) == "L") { result += 50; index += 1; }
    else if (value.substr(index, 2) == "XL") { result += 40; index += 2; }
    else if (value.substr(index, 3) == "XXX") { result += 30; index += 3; }
    else if (value.substr(index, 2) == "XX") { result += 20; index += 2; }
    else if (value.substr(index, 1) == "X") { result += 10; index += 1; }

    if (value.substr(index, 2) == "IX") { result += 9; index += 2; }
    else if (value.substr(index, 4) == "VIII") { result += 8; index += 4; }
    else if (value.substr(index, 3) == "VII") { result += 7; index += 3; }
    else if (value.substr(index, 2) == "VI") { result += 6; index += 2; }
    else if (value.substr(index, 1) == "V") { result += 5; index += 1; }
    else if (value.substr(index, 2) == "IV") { result += 4; index += 2; }
    else if (value.substr(index, 3) == "III") { result += 3; index += 3; }
    else if (value.substr(index, 2) == "II") { result += 2; index += 2; }
    else if (value.substr(index, 1) == "I") { result += 1; index += 1; }

    if (index != value.length) {
        throw new InvalidDateException(`${value} is not a valid Roman number`);
    }

    return result;
}

function germanCalendar(romanDay: number, romanText: number, romanMonth: number, year: number, calendar: Calendar) {
    let leapYear = isLeapYear(year, calendar);

    if (romanText == 1 && romanMonth == 3 && leapYear) {
        romanDay--;
        if (romanDay == 1) {
            return { day: 29, month: 2 };
        }
    }

    if (romanDay == 1) {
        romanDay = 0;
    }

    let firstDay = false;
    let daysBefore = romanDay;
    let day = 0;
    let month = romanMonth;

    if (daysBefore == 0) {
        daysBefore = 1;
        firstDay = romanText == 1;
    }

    if (firstDay) {
        day = 1;
    } else {
        if (romanText != 1 && (romanMonth == 3 || romanMonth == 5 || romanMonth == 7 || romanMonth == 10)) {
            daysBefore = daysBefore - 2;
        }

        switch (romanText) {
            case 1:
                // before the Kalendes
                month = romanMonth == 1 ? 12 : romanMonth - 1;

                let kal: number;
                if (month == 4 || month == 6 || month == 9 || month == 11) {
                    kal = 32;
                }
                else if (month == 2) {
                    kal = 30;
                }
                else {
                    kal = 33;
                }
                day = kal - daysBefore;
                break;
            case 2:
                day = 6 - daysBefore;
                break;
            case 3:
                day = 14 - daysBefore;
                break;
        }
    }

    if (day < 1 || day > 31) {
        throw new InvalidDateException();
    } else {
        return {
            day,
            month
        };
    }
}

function romanCalendar(date: HistoricalDate) {
    let day = date.day;

    if ((day >= 15) && (date.month == 2) && date.isLeapYear) {
        day--;
    }
    else if ((day == 14) && (date.month == 2) && date.isLeapYear) {
        return {
            romanDay: 'a.d.XVII.' as RomanDay,
            romanText: 'Kal.' as RomanText,
            romanMonth: 3,
            romanMonthName: 'Mart.' as RomanMonth
        };
    }

    let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let text: 0 | 1 | 2 = 0;
    let beforeText = 0;
    let textDay = day;
    let romanMonth = date.month;

    if (textDay == 1) {
        textDay = monthDays[date.month - 1] + 1;
    }

    if ((romanMonth == 3) || (romanMonth == 5) || (romanMonth == 7) || (romanMonth == 10)) {
        // within the Id.?
        if (textDay < 16) {
            text = 1;
            textDay = textDay + 17;
            if (textDay < 25) {
                text = 2;
                textDay = textDay + 8;
            }
        }
    } else if (textDay < 14) {
        text = 1;
        monthDays[1] = monthDays[3] = monthDays[5] = monthDays[8] = monthDays[10] = 31;
        textDay = textDay + 19;
        if (textDay < 25) {
            text = 2;
            textDay = textDay + 8;
        }
    }

    // how many days before the Kal. Id. or Non.?
    beforeText = monthDays[date.month - 1] + 2 - textDay;

    let romanDay: RomanDay, romanText: RomanText, romanMonthName: RomanMonth;

    if (beforeText == 1) {
        romanDay = "";
        if (text == 0) {
            romanMonth--;
        }
    }
    else if (beforeText == 2) {
        romanDay = "pr.";
    }
    else {
        romanDay = `a.d.${toRomanNumber(beforeText)}.` as RomanDay;
    }

    switch (text) {
        case 0:
            romanText = "Kal.";
            romanMonth++;
            if (romanMonth == 13) {
                romanMonth = 1;
            }
            break;
        case 1:
            romanText = "Id.";
            break;
        case 2:
            romanText = "Non.";
            break;
        default:
            throw new InvalidDateException(`Unhandled text type ${text}`);
    }

    const monthNames: RomanMonth[] = ["Ian.", "Feb.", "Mart.", "Apr.", "Mai.", "Jun.", "Jul.", "Sext.", "Sept.", "Oct.", "Nov.", "Dec."];
    romanMonthName = monthNames[romanMonth - 1];

    return { romanDay, romanText, romanMonthName };
}

export function toRomanNumber(value: number) {
    let thousand = (value - value % 1000) / 1000;
    let hundred = ((value - value % 100) / 100) - (thousand * 10);
    let decimal = ((value - value % 10) / 10) - (thousand * 100 + hundred * 10);
    let digit = value - (thousand * 1000 + hundred * 100 + decimal * 10);
    return ["", "M", "MM", "MMM"][thousand] +
        ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"][hundred] +
        ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"][decimal] +
        ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][digit];
}
