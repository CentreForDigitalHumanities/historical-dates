
import { Calendar } from './calendar';
import { JulianDate } from "./julian-date";
import { GregorianDate } from "./gregorian-date";

export abstract class HistoricalDate {
    constructor(public readonly calendar: Calendar) { }

    abstract year: number | undefined;
    abstract month: number | undefined;
    abstract day: number | undefined;
    abstract readonly isLeapYear: boolean;
    abstract toGregorian(): GregorianDate;
    abstract toJulian(): JulianDate

    /**
     * Returns a new date which is moved by the specified number of days.
     */
    abstract addDays(days: number): HistoricalDate;

    toDate(): Date {
        let gregorian = this.toGregorian();
        return new Date(gregorian.year || 1, (gregorian.month || 1) - 1, (gregorian.day || 1));
    }

    /**
     * Checks whether this is the same date as another date.
     */
    equals(other: HistoricalDate) {
        let converted: HistoricalDate;
        if (this.calendar === 'gregorian') {
            converted = other.toGregorian();
        } else {
            converted = other.toJulian();
        }

        return this.year === converted.year &&
            this.month === converted.month &&
            this.day === converted.day;
    }
}
