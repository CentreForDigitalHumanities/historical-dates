/**
 * Derived from http://www.nabkal.de/ostrech1.html
 */
export type Calendar = 'julian' | 'gregorian';
const Littera = new Array("f", "e", "d", "c", "b", "A", "g");
const EpaktFeld = new Array("XXIII", "XXII", "XXI", "XX", "XIX", "XVIII", "XVII", "XVI", "XV", "XIV", "XIII", "XII", "XI", "X", "IX", "VIII", "VII", "VI", "V", "IV", "III", "II", "I", " * ", "XXIX", "XXVIII", "XXVII", "XXVI", "XXV", "XXIV", "25");

export function calculate(year: number, style: Calendar) {
    var JD = getEasterDay(year, style);
    return {
        DatOst: makeDate(JD, style),
        DatSept: makeDate(JD - 63, style),
        DatAsch: makeDate(JD - 46, style),
        DatHimm: makeDate(JD + 39, style),
        DatPfingst: makeDate(JD + 49, style),
        DatTrin: makeDate(JD + 56, style),
        DatFron: makeDate(JD + 60, style),
        DatAdv: makeDateAdv(year, style)
    }
}

function makeDate(jd: number, s: Calendar) {
    var tz = jd - 1721119;
    if (s == 'gregorian') { tz += floor(tz / 36524.25) - floor(tz / 146097) - 2 }
    tz += 2;
    var y = floor((tz - 0.2) / 365.25);
    var r = tz - floor(y * 365.25);
    var m = floor((r - 0.5) / 30.6);
    var d = r - floor(m * 30.6 + 0.5);
    m += 3;
    if (m > 12) { m -= 12; y++ }
    return { day: d, month: m, year: y };
}

function makeDateAdv(y: number, s: Calendar) {
    var a = getDay(25, 12, y, s);
    var jd = a - mod(a, 7) - 22;
    var x = makeDate(jd, s);
    return x;
}
function getEasterDay(year: number, style: Calendar) {
    let ostern = EastCalc(year, style);
    let x = getDay(22, 3, year, style) + ostern;
    return x;
}

function EastCalc(y: number, stil: Calendar) {
    var m, q;
    var H1 = floor(y / 100);
    var H2 = floor(y / 400);
    if (stil == 'julian') // julianisch
    {
        m = 15;
        q = 6;
    }
    else {
        m = 15 + H1 - H2 - floor((8 * H1 + 13) / 25);
        q = 4 + H1 - H2;
    };
    var a = mod(y, 19);
    var b = mod(y, 4);
    var c = mod(y, 7);
    var d = mod((19 * a + m), 30);
    var e = mod((2 * b + 4 * c + 6 * d + q), 7);
    var g = d + e;
    if (g == 35) { g = 28; }
    if ((d == 28) && (e == 6) && (a > 10)) { g = 27; }
    var x = g; // Ostern + 22 als M�rzdatum
    var GZ = a + 1; //Goldene Zahl
    var GD = d; // Gauss d
    var GM = mod(m, 30); // Gauss m
    var KK = mod(2 - (2 * b + 4 * c + q), 7) + 1; // Konkurrente
    var SB = Littera[KK - 1];
    var epa = GD;
    if ((epa == 28) && (a > 10)) { epa = 30; }
    if (stil == 'julian') {
        epa = mod((epa + 8), 30);
    }
    var EP = EpaktFeld[epa]; // Epakte
    return x;
}
function floor(x: number) {
    return Math.floor(x)
}
function mod(n: number, d: number) {
    var q = n % d;
    return q < 0 ? d + q : q;
}
function getDay(d: number, m: number, y: number, s: Calendar) {
    m -= 3;
    if (m < 0) { m += 12; y--; }
    var x = floor(y * 365.25) + floor(m * 30.6 + 0.5) + d + 1721117;
    if (s == 'gregorian') {
        x -= floor(y / 100) - floor(y / 400) - 2;
    }
    return x
}
