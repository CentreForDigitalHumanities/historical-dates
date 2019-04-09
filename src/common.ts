import { Calendar } from './calendar';
import { JulianDate } from "./julian-date";
import { GregorianDate } from "./gregorian-date";
import * as XRegExp from 'xregexp';
import { fromRomanNumber } from './roman';

const MonthPatterns: { [date: number]: string } =
{
    1: '[ij]an',
    2: 'feb',
    3: 'mart?',
    4: 'apr',
    5: 'ma[ij]',
    6: '[ij]un',
    7: '[ij]ul',
    8: 'se[cxk]t?|august',
    9: 'sept?',
    10: 'o[ck]t',
    11: 'nov',
    12: 'de[ck]',
}
let CompiledMonthPatterns: { [date: number]: RegExp } = {}
for (let month = 1; month <= 12; month++) {
    CompiledMonthPatterns[month] = new RegExp(`^${MonthPatterns[month]}\.?$`, 'i');
}

const AnyMonthPattern = `(${Object.keys(MonthPatterns).map((_, index) => MonthPatterns[index + 1]).join('|')}\.?)`;
// Roman or Arabic number
const NumberPattern = '([MDCLXVI]( ?[MDCLXVI])*|[0-9]+)';
const DateFormats: RegExp[] = [
    '^(?<month>{month}) (?<day>{day}), (?<year>{year})$',
    '^(?<day>{day}) (?<month>{month}) (?<year>{year})$'
].map((pattern) => XRegExp(pattern.replace('{month}', AnyMonthPattern)
    .replace('{day}', NumberPattern)
    .replace('{year}', NumberPattern), 'i'));

export function isLeapYear(year: number, calendar: Calendar = 'gregorian') {
    if (calendar == 'gregorian') {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    } else {
        return year % 4 === 0 || year <= 0;
    }
}

export function createDate(year: number, month: number, day: number, calendar: Calendar = 'gregorian') {
    switch (calendar) {
        case 'gregorian':
            return new GregorianDate(year, month, day);
        case 'julian':
            return new JulianDate(year, month, day);
    }
}

export function parseDateString(text: string) {
    for (const format of DateFormats) {
        const match = XRegExp.exec(text, format) as any;
        if (match) {
            const day = fromRomanNumber(match['day']),
                month = parseMonthString(match['month']),
                year = fromRomanNumber(match['year']);
            if (month === null) {
                return null;
            }
            return { day, month, year };
        }
    }

    return null;
}

function parseMonthString(text: string) {
    for (let month = 1; month <= 12; month++) {
        if (CompiledMonthPatterns[month].test(text)) {
            return month;
        }
    }
    return null;
}