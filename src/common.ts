import { Calendar } from './calendar';
import { JulianDate } from "./julian-date";
import { GregorianDate } from "./gregorian-date";

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
