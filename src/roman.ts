import { isLeapYear } from './common';
/**
 * Derived from http://cgi.axel-findling.de/cgi-bin/romdat
 * Originally written by Axel Findling.
 * Modified by Sheean Spoel, Digital Humanities Lab, Utrecht University.
 */
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

export type RomanMonth = keyof typeof RomanMonths;
export type RomanDay = keyof typeof RomanDays;
export type RomanText = keyof typeof RomanTexts;

export function toRoman(day: number, month: number, year: number) {
    let { romanDay, romanText, romanMonth, romanMonthName } = romanCalendar(day, month, year);
    let romanYear = toRomanNumber(year);

    return new RomanDate(romanDay, romanText, romanMonthName, romanYear);
}

export function fromRoman(day: RomanDay, text: RomanText, month: RomanMonth, year: string) {
    year = year.replace(/[^MDCLXVI]/gi, '').toUpperCase();
    let germanYear = fromRomanNumber(year);
    let date = germanCalendar(RomanDays[day], RomanTexts[text], RomanMonths[month], germanYear);

    return { day: date.day, month: date.month, year: germanYear };
}

function fromRomanNumber(value: string) {
    let index = 0;
    let result = 0;

    if (substr(value, index, 3) == "MMM") { result += 3000; index += 3; }
    else if (substr(value, index, 2) == "MM") { result += 2000; index += 2; }
    else if (substr(value, index, 1) == "M") { result += 1000; index += 1; }

    if (substr(value, index, 2) == "CM") { result += 900; index += 2; }
    else if (substr(value, index, 4) == "DCCC") { result += 800; index += 4; }
    else if (substr(value, index, 3) == "DCC") { result += 700; index += 3; }
    else if (substr(value, index, 2) == "DC") { result += 600; index += 2; }
    else if (substr(value, index, 1) == "D") { result += 500; index += 1; }
    else if (substr(value, index, 2) == "CD") { result += 400; index += 2; }
    else if (substr(value, index, 3) == "CCC") { result += 300; index += 3; }
    else if (substr(value, index, 2) == "CC") { result += 200; index += 2; }
    else if (substr(value, index, 1) == "C") { result += 100; index += 1; }

    if (substr(value, index, 2) == "XC") { result += 90; index += 2; }
    else if (substr(value, index, 4) == "LXXX") { result += 80; index += 4; }
    else if (substr(value, index, 3) == "LXX") { result += 70; index += 3; }
    else if (substr(value, index, 2) == "LX") { result += 60; index += 2; }
    else if (substr(value, index, 1) == "L") { result += 50; index += 1; }
    else if (substr(value, index, 2) == "XL") { result += 40; index += 2; }
    else if (substr(value, index, 3) == "XXX") { result += 30; index += 3; }
    else if (substr(value, index, 2) == "XX") { result += 20; index += 2; }
    else if (substr(value, index, 1) == "X") { result += 10; index += 1; }

    if (substr(value, index, 2) == "IX") { result += 9; index += 2; }
    else if (substr(value, index, 4) == "VIII") { result += 8; index += 4; }
    else if (substr(value, index, 3) == "VII") { result += 7; index += 3; }
    else if (substr(value, index, 2) == "VI") { result += 6; index += 2; }
    else if (substr(value, index, 1) == "V") { result += 5; index += 1; }
    else if (substr(value, index, 2) == "IV") { result += 4; index += 2; }
    else if (substr(value, index, 3) == "III") { result += 3; index += 3; }
    else if (substr(value, index, 2) == "II") { result += 2; index += 2; }
    else if (substr(value, index, 1) == "I") { result += 1; index += 1; }

    if (index != length(value)) {
        throw new InvalidDateException();
    }

    return result;
}

function germanCalendar(romanDay: number, romanText: number, romanMonth: number, year: number) {
    let leapYear = isLeapYear(year);

    if ((romanText == 1) && (romanMonth == 3) && leapYear) {
        romanDay--;
        if (romanDay == 1) {
            return { day: 29, month: 2 };
        }
    }

    if (romanDay == 1) {
        romanDay = 0;
    }

    let $MC0 = romanText;
    let $MC1 = romanDay;
    let day = 0;
    let $MC4 = 0;
    let month = romanMonth;

    if ($MC1 == 0) {
        $MC1 = 1;
        if ($MC0 == 1) {
            // first day of month
            $MC0 = 4;
        }
    }

    if ($MC0 == 1) {
        // before the Kalendes
        month = romanMonth == 1 ? 12 : romanMonth - 1;
    }
    else if ((romanMonth == 3) || (romanMonth == 5) || (romanMonth == 7) || (romanMonth == 10)) {
        $MC1 = $MC1 - 2;
    }

    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
        $MC4 = 32;
    }
    else if (month == 2) {
        $MC4 = 30;
    }
    else {
        $MC4 = 33;
    }

    switch ($MC0) {
        case 1:
            day = $MC4 - $MC1;
            break;
        case 2:
            day = 6 - $MC1;
            break;
        case 3:
            day = 14 - $MC1;
            break;
        case 4:
            day = 1;
            break;
    }

    if ((day < 1) || (day > 31)) {
        throw new InvalidDateException();
    } else {
        return {
            day,
            month
        };
    }
}

function substr(value: any, from: number, length: number) {
    return `${value}`.substr(from, length);
}

function length(value: any) {
    return `${value}`.length;
}

function romanCalendar(day: number, month: number, year: number) {
    let leapYear = isLeapYear(year);

    if ((day > 29) && (month == 2)) {
        throw new InvalidDateException();
    }
    else if ((day > 28) && (month == 2) && !leapYear) {
        throw new InvalidDateException();
    }
    else if ((day > 30) && ((month == 4) || (month == 6) || (month == 9) || (month == 11))) {
        throw new InvalidDateException();
    }
    else if ((day > 31) && ((month == 1) || (month == 3) || (month == 5) || (month == 7) || (month == 10) || (month == 12))) {
        throw new InvalidDateException();
    }
    else if ((month < 1) || (month > 12)) {
        throw new InvalidDateException();
    }
    else if (day < 1) {
        throw new InvalidDateException();
    }

    if ((day >= 15) && (month == 2) && leapYear) {
        day--;
    }
    else if ((day == 14) && (month == 2) && leapYear) {
        return {
            romanDay: 'a.d.XVII.' as RomanDay,
            romanText: 'Kal.' as RomanText,
            romanMonth: 3,
            romanMonthName: 'Mart.' as RomanMonth
        };
    }

    let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let text = 0;
    let beforeText = 0;
    let textDay = day;
    let romanMonth = month;

    if (textDay == 1) {
        textDay = monthDays[month - 1] + 1;
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
    beforeText = monthDays[month - 1] + 2 - textDay;

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

    if (text == 0) {
        romanText = "Kal.";
        romanMonth++;
        if (romanMonth == 13) {
            romanMonth = 1;
        }
    }
    else if (text == 1) {
        romanText = "Id.";
    }
    else if (text == 2) {
        romanText = "Non.";
    }

    const monthNames: RomanMonth[] = ["Ian.", "Feb.", "Mart.", "Apr.", "Mai.", "Jun.", "Jul.", "Sext.", "Sept.", "Oct.", "Nov.", "Dec."];
    romanMonthName = monthNames[romanMonth - 1];

    return { romanDay, romanText, romanMonth, romanMonthName };
}

function toRomanNumber($year: number) {
    let $t = ($year - $year % 1000) / 1000;
    let $h = (($year - $year % 100) / 100) - ($t * 10);
    let $z = (($year - $year % 10) / 10) - ($t * 100 + $h * 10);
    let $e = $year - ($t * 1000 + $h * 100 + $z * 10);
    let $E = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    let $Z = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
    let $H = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
    let $T = ["", "M", "MM", "MMM"];
    return $T[$t] + $H[$h] + $Z[$z] + $E[$e];
}

export class RomanDate {
    constructor(public day: RomanDay,
        public text: RomanText,
        public month: RomanMonth,
        public year: string) {
    }

    toString() {
        return `${this.day}${this.text}${this.month} ${this.year}`;
    }
}

export class InvalidDateException {

}