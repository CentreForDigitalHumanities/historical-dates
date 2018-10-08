/**
 * Derived from http://www.nabkal.de/ostrech1.html
 * Originally written by Nikolaus A. Bär.
 * Modified by Sheean Spoel, Digital Humanities Lab, Utrecht University.
 */
import { Calendar } from './calendar';
import { createDate } from './common';
import { fromRomanNumber } from './roman';

type DominicalLettersTuple = ["F", "E", "D", "C", "B", "A", "G"];
const DominicalLetters: DominicalLettersTuple = ["F", "E", "D", "C", "B", "A", "G"];

type EpactsTuple = ["XXIII", "XXII", "XXI", "XX", "XIX", "XVIII", "XVII", "XVI", "XV", "XIV", "XIII", "XII", "XI", "X", "IX", "VIII", "VII", "VI", "V", "IV", "III", "II", "I", " * ", "XXIX", "XXVIII", "XXVII", "XXVI", "XXV", "XXIV", "25"];
const Epacts: EpactsTuple = ["XXIII", "XXII", "XXI", "XX", "XIX", "XVIII", "XVII", "XVI", "XV", "XIV", "XIII", "XII", "XI", "X", "IX", "VIII", "VII", "VI", "V", "IV", "III", "II", "I", " * ", "XXIX", "XXVIII", "XXVII", "XXVI", "XXV", "XXIV", "25"];

/**
 * Calculates the date for Easter and the associated dates.
 * @param year The unabbreviated (Roman) year number.
 * @param calendar The calendar style to use.
 */
export function calcEaster(year: number | string, calendar: Calendar = 'gregorian') {
    if (typeof (year) != 'number') {
        if (/^\d+$/.test(year)) {
            year = parseInt(year);
        } else {
            year = fromRomanNumber(year);
        }
    }
    
    let easterDay = getEasterDay(year, calendar);
    let jd = easterDay.jd;

    return {
        /**
         * Easter Sunday.
         */
        sunday: makeDate(jd, calendar),
        /**
         * Ninth Sunday before Easter.
         */
        septuagesima: makeDate(jd - 63, calendar),
        ashWednesday: makeDate(jd - 46, calendar),
        ascensionDay: makeDate(jd + 39, calendar),
        /**
         * Also called Whitsunday.
         */
        pentecost: makeDate(jd + 49, calendar),
        /**
         * First Sunday after Pentecost.
         */
        trinitySunday: makeDate(jd + 56, calendar),
        /**
         * Thursday after Trinity Sunday.
         */
        corpusChristi: makeDate(jd + 60, calendar),
        adventSunday: makeDateAdv(year, calendar),
        epact: easterDay.epact,
        goldenNumber: easterDay.goldenNumber,
        /**
         * Weekday of 24th of March.
         */
        concurrent: easterDay.concurrent,
        /**
         * Dominical letter associated with this year.
         */
        dominicalLetter: easterDay.dominicalLetter
    }
}

function makeDate(jd: number, calendar: Calendar) {
    let tz = jd - 1721119;
    if (calendar == 'gregorian') {
        tz += floor(tz / 36524.25) - floor(tz / 146097) - 2
    }
    tz += 2;
    let year = floor((tz - 0.2) / 365.25);
    let r = tz - floor(year * 365.25);
    let month = floor((r - 0.5) / 30.6);
    let day = r - floor(month * 30.6 + 0.5);
    month += 3;
    if (month > 12) { month -= 12; year++ }
    return createDate(year, month, day, calendar);
}

function makeDateAdv(year: number, calendar: Calendar) {
    let a = getDay(25, 12, year, calendar);
    let jd = a - mod(a, 7) - 22;
    let x = makeDate(jd, calendar);
    return x;
}

function getEasterDay(year: number, calendar: Calendar) {
    let easter = computus(year, calendar);
    return {
        jd: getDay(22, 3, year, calendar) + easter.marchOffset,
        epact: easter.epact,
        goldenNumber: easter.goldenNumber,
        concurrent: easter.concurrent,
        dominicalLetter: easter.dominicalLetter
    };
}

/**
 * Computus is a calculation that determines the calendar date of Easter.
 */
function computus(year: number, calendar: Calendar) {
    let m: number, q: number;
    let h1 = floor(year / 100);
    let h2 = floor(year / 400);
    if (calendar == 'julian') {
        m = 15;
        q = 6;
    } else {
        m = 15 + h1 - h2 - floor((8 * h1 + 13) / 25);
        q = 4 + h1 - h2;
    }
    let a = mod(year, 19);
    let b = mod(year, 4);
    let c = mod(year, 7);
    let d = mod((19 * a + m), 30);
    let e = mod((2 * b + 4 * c + 6 * d + q), 7);
    let g = d + e;
    if (g == 35) {
        g = 28;
    }
    if ((d == 28) && (e == 6) && (a > 10)) {
        g = 27;
    }

    // Easter + 22 days
    let marchOffset = g;
    let goldenNumber = a + 1;
    let concurrent = mod(2 - (2 * b + 4 * c + q), 7) + 1;
    let dominicalLetter = DominicalLetters[concurrent - 1];
    let epact = d;
    if (epact == 28 && a > 10) {
        epact = 30;
    }
    if (calendar == 'julian') {
        epact = mod(epact + 8, 30);
    }
    let epactLabel = Epacts[epact];
    return {
        /**
         * Offset from 22th of March
         */
        marchOffset,
        epact: epactLabel,
        goldenNumber,
        concurrent,
        dominicalLetter
    };
}

function floor(x: number) {
    return Math.floor(x)
}

function mod(n: number, d: number) {
    let q = n % d;
    return q < 0 ? d + q : q;
}

function getDay(day: number, month: number, year: number, calendar: Calendar) {
    month -= 3;
    if (month < 0) { month += 12; year--; }
    let x = floor(year * 365.25) + floor(month * 30.6 + 0.5) + day + 1721117;
    if (calendar == 'gregorian') {
        x -= floor(year / 100) - floor(year / 400) - 2;
    }
    return x
}
