import { Calendar } from './calendar';
import { JulianDate } from "./julian-date";
import { GregorianDate } from "./gregorian-date";
import * as XRegExp from 'xregexp';
import { fromRomanNumber } from './roman';

const MonthPatterns: { [date: number]: string } =
{
    1: '([ij]an(uar(y|ii?)|)|janvier)',
    2: '(feb(ruar[yi]?|r|)|fevrier)',
    3: '(march|mars|marti[ia]s?|mart?)',
    4: '(a[pv]ril|aprilis|apr)',
    5: '(ma[ijy]|maji)',
    6: '[ij]ui?n(ias|e|)',
    7: '([ij]uillet|[ij]ul[iay]s?)',
    8: '(se[cxk]t?|august(us|i|)|ao[uû]s?t|aug)',
    9: 'sep(ti?emb(er|re|r|)|t|)',
    10: 'o[ck]t(ob(er|re|r|)|)',
    11: 'nov(emb(er|re|ris|r|)|)',
    12: 'de[ck](emb(er|re|ris|r|)|)',
}
let CompiledMonthPatterns: { [date: number]: RegExp } = {}
for (let month = 1; month <= 12; month++) {
    CompiledMonthPatterns[month] = new RegExp(`^${MonthPatterns[month]}\.?$`, 'i');
}

const AnyMonthPattern = `(${Object.keys(MonthPatterns).map((_, index) => MonthPatterns[index + 1]).join('|')}\.?)`;
// Roman or Arabic number
const NumberPattern = '([MDCLXVI]( ?[MDCLXVI])*|[0-9]+)';
const DateFormats: RegExp[] = [
    '^(?<month>{month}) (?<day>{day}), (?<year>{year})\.?$',
    '^(ad|) ?(?<day>{day})[\.,]? ?(?<month>{month})\.? ?(ao\.?|a\.?c\.?|anno|an\.? christi|an\.?|) ?(?<year>{year})\.?$',
    '^(le|ce|) ?(?<day>{day})\.? (|de |d\')(?<month>{month}) (?<year>{year})\.?$',
    '^[aàá]? ?(?<day>{day})\.? de (?<month>{month}) del? a[nn̄n̄]*o de (?<year>{year})\.?$'
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