export type Calendar = 'julian' | 'gregorian';

export function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export class HistoricalDate {
    constructor(public year: number, public month: number, public day: number, public calendar: Calendar = 'gregorian') {
    }
}
