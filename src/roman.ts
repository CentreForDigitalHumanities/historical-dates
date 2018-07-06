/**
 * Derived from http://cgi.axel-findling.de/cgi-bin/romdat
 * Originally written by Axel Findling.
 * Modified by Sheean Spoel, Digital Humanities Lab, Utrecht University.
 */
const RMONAT = {
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
const RTAG = {
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
const RTXT = { "Kal.": 1, "Non.": 2, "Id.": 3 };

export type rmonats = keyof typeof RMONAT;
export type rtags = keyof typeof RTAG;
export type rtxts = keyof typeof RTXT;

export function toRoman(tag: number, monat: number, jahr: number) {
    let { rtag, rtxt, rmonat } = romanCalendar(tag, monat, jahr);
    let $youryear = toRomanNumber(jahr);

    return new RomanDate(rtag, rtxt, rmonat, $youryear);
}

export function fromRoman<T>(rtag: rtags, rtxt: rtxts, rmonat: rmonats, rjahr: string) {
    rjahr = rjahr.replace(/[^MDCLXVI]/gi, '').toUpperCase();
    let $youryear = dyear(rjahr);
    let $yourday = rkaldkal(RTAG[rtag], RTXT[rtxt], RMONAT[rmonat], $youryear);

    return { day: $yourday.day, month: $yourday.month, year: $youryear };
}

function dyear($year: string) {
    let $i = 0;
    let $res = 0;

    if (substr($year, $i, 3) == "MMM") { $res += 3000; $i += 3; }
    else if (substr($year, $i, 2) == "MM") { $res += 2000; $i += 2; }
    else if (substr($year, $i, 1) == "M") { $res += 1000; $i += 1; }

    if (substr($year, $i, 2) == "CM") { $res += 900; $i += 2; }
    else if (substr($year, $i, 4) == "DCCC") { $res += 800; $i += 4; }
    else if (substr($year, $i, 3) == "DCC") { $res += 700; $i += 3; }
    else if (substr($year, $i, 2) == "DC") { $res += 600; $i += 2; }
    else if (substr($year, $i, 1) == "D") { $res += 500; $i += 1; }
    else if (substr($year, $i, 2) == "CD") { $res += 400; $i += 2; }
    else if (substr($year, $i, 3) == "CCC") { $res += 300; $i += 3; }
    else if (substr($year, $i, 2) == "CC") { $res += 200; $i += 2; }
    else if (substr($year, $i, 1) == "C") { $res += 100; $i += 1; }

    if (substr($year, $i, 2) == "XC") { $res += 90; $i += 2; }
    else if (substr($year, $i, 4) == "LXXX") { $res += 80; $i += 4; }
    else if (substr($year, $i, 3) == "LXX") { $res += 70; $i += 3; }
    else if (substr($year, $i, 2) == "LX") { $res += 60; $i += 2; }
    else if (substr($year, $i, 1) == "L") { $res += 50; $i += 1; }
    else if (substr($year, $i, 2) == "XL") { $res += 40; $i += 2; }
    else if (substr($year, $i, 3) == "XXX") { $res += 30; $i += 3; }
    else if (substr($year, $i, 2) == "XX") { $res += 20; $i += 2; }
    else if (substr($year, $i, 1) == "X") { $res += 10; $i += 1; }

    if (substr($year, $i, 2) == "IX") { $res += 9; $i += 2; }
    else if (substr($year, $i, 4) == "VIII") { $res += 8; $i += 4; }
    else if (substr($year, $i, 3) == "VII") { $res += 7; $i += 3; }
    else if (substr($year, $i, 2) == "VI") { $res += 6; $i += 2; }
    else if (substr($year, $i, 1) == "V") { $res += 5; $i += 1; }
    else if (substr($year, $i, 2) == "IV") { $res += 4; $i += 2; }
    else if (substr($year, $i, 3) == "III") { $res += 3; $i += 3; }
    else if (substr($year, $i, 2) == "II") { $res += 2; $i += 2; }
    else if (substr($year, $i, 1) == "I") { $res += 1; $i += 1; }

    if ($i != length($year)) {
        throw new InvalidDateException();
    }

    return $res;
}

function rkaldkal($MI1: number, $MI0: number, $MI2: number, $MC2F: number) {
    // P0
    let $MC, $schaltjahr = 0;

    if ($MC2F % 4 == 0) {
        if (!((substr($MC2F, length($MC2F) - 2, 2) == "00") && (substr($MC2F, length($MC2F) - 3, 1) != "0"))) {
            $schaltjahr = 1;
        }
    }
    if (($MI0 == 1) && ($MI2 == 3) && ($schaltjahr == 1)) {
        $MI1--;
        if ($MI1 == 1) {
            return { day: 29, month: 2 };
        }
    }

    //    @MONAT=("", "Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");

    if ($MI1 == 1) {
        $MI1 = 0;
    }

    $MC = [$MI0, $MI1, $MI2, 0, 0, $MI2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    if ($MC[1] == 0) {
        // P0LBL8
        // P5 (SUB)
        $MC[1] = 1;
        if ($MC[0] == 1) {
            $MC[0] = 4;
        }
        // P5 (END)
    }
    // P0LBL9
    if ($MC[0] == 1) {
        $MC[5] = $MC[2] - 1;                                                // P0LBL1
    }
    else if (($MC[2] == 3) || ($MC[2] == 5) || ($MC[2] == 7) || ($MC[2] == 10)) {
        $MC[1] = $MC[1] - 2;                                                // P0LBL2
    }
    // P0LBL3
    if (($MC[5] == 4) || ($MC[5] == 6) || ($MC[5] == 9) || ($MC[5] == 11)) {
        $MC[4] = 32;                                                      // P0LBL4
    }
    else if ($MC[5] == 2) {
        $MC[4] = 30;                                                      // P0LBL5
    }
    else {
        $MC[4] = 33;                                                      // P0LBL6
    }
    // P0LBL7
    if ($MC[0] == 1) {
        // P1 (SUB)
        $MC[3] = $MC[4] - $MC[1];
        // P1 (END)
    }
    else if ($MC[0] == 2) {
        // P2 (SUB)
        $MC[3] = 6 - $MC[1];
        // P2 (END)
    }
    else if ($MC[0] == 3) {
        // P3 (SUB)
        $MC[3] = 14 - $MC[1];
        // P3 (END)
    }
    else if ($MC[0] == 4) {
        // P4 (SUB)
        $MC[3] = 1;
        // P4 (END)
    }

    if (($MC[3] < 1) || ($MC[3] > 31)) {
        throw new InvalidDateException();
    } else {
        return {
            day: $MC[3],
            month: $MC[5]
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
    let leapYear = false;

    if (year % 4 == 0) {
        if (!((`${year}`.substr(-2) == "00") && (`${year}`.substr(-3, 1) != "0"))) {
            leapYear = true;
        }
    }

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
            rtag: 'a.d.XVII.' as rtags,
            rtxt: 'Kal.' as rtxts,
            rmonat: 'Mart.' as rmonats
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

    let rtag: rtags, rtxt: rtxts, rmonat: rmonats;

    if (beforeText == 1) {
        rtag = "";
        if (text == 0) {
            romanMonth--;
        }
    }
    else if (beforeText == 2) {
        rtag = "pr.";
    }
    else {
        rtag = `a.d.${toRomanNumber(beforeText)}.` as rtags;
    }

    if (text == 0) {
        rtxt = "Kal.";
        romanMonth++;
        if (romanMonth == 13) {
            romanMonth = 1;
        }
    }
    else if (text == 1) {
        rtxt = "Id.";
    }
    else if (text == 2) {
        rtxt = "Non.";
    }

    const monthNames: rmonats[] = ["Ian.", "Feb.", "Mart.", "Apr.", "Mai.", "Jun.", "Jul.", "Sext.", "Sept.", "Oct.", "Nov.", "Dec."];
    rmonat = monthNames[romanMonth - 1];

    return { rtag, rtxt, rmonat };
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
    constructor(public rtag: rtags,
        public rtxt: rtxts,
        public rmonat: rmonats,
        public year: string) {
    }

    toString() {
        return `${this.rtag}${this.rtxt}${this.rmonat} ${this.year}`;
    }
}

export class InvalidDateException {

}