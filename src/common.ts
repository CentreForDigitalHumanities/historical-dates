import { JulianDate } from "./julian";
import { GregorianDate } from "./gregorian";

export class InvalidDateException {
    constructor(public message: string | null= null) { }
}

export type Calendar = HistoricalDate['calendar'];

export function isLeapYear(year: number, calendar: Calendar = 'gregorian') {
    if (calendar == 'gregorian') {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    } else {
        return year % 4 === 0 || year <= 0;
    }
}

export type HistoricalDate = JulianDate | GregorianDate;

export function createDate(year: number, month: number, day: number, calendar: Calendar = 'gregorian') {
    switch (calendar) {
        case 'gregorian':
            return new GregorianDate(year, month, day);
        case 'julian':
            return new JulianDate(year, month, day);
    }
}
