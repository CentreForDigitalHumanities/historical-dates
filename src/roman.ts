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
    let { rtag, rtxt, rmonat } = rkalender(tag, monat, jahr);
    let $youryear = ryear(jahr);

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

function rkalender(tag: number, monat: number, jahr: number) {
    // P0
    let $MCF = tag;
    let $MC1F = monat;
    let $MC2F = jahr;
    // local($MCF,$MC1F,$MC2F)=@_;
    // local(@MC);
    // local($STR);
    let $schaltjahr = 0;

    if ($MC2F % 4 == 0) {
        if (!((`${$MC2F}`.substr(-2) == "00") && (`${$MC2F}`.substr(-3, 1) != "0"))) {
            $schaltjahr = 1;
        }
    }

    if (($MCF > 29) && ($MC1F == 2)) {
        throw new InvalidDateException();
    }
    else if (($MCF > 28) && ($MC1F == 2) && ($schaltjahr == 0)) {
        throw new InvalidDateException();
    }
    else if (($MCF > 30) && (($MC1F == 4) || ($MC1F == 6) || ($MC1F == 9) || ($MC1F == 11))) {
        throw new InvalidDateException();
    }
    else if (($MCF > 31) && (($MC1F == 1) || ($MC1F == 3) || ($MC1F == 5) || ($MC1F == 7) || ($MC1F == 10) || ($MC1F == 12))) {
        throw new InvalidDateException();
    }
    else if (($MC1F < 1) || ($MC1F > 12)) {
        throw new InvalidDateException();
    }
    else if ($MCF < 1) {
        throw new InvalidDateException();
    }

    if (($MCF >= 15) && ($MC1F == 2) && ($schaltjahr == 1)) {
        $MCF--;
    }
    else if (($MCF == 14) && ($MC1F == 2) && ($schaltjahr == 1)) {
        return {
            rtag: 'a.d.XVII.' as rtags,
            rtxt: 'Kal.' as rtxts,
            rmonat: 'Mart.' as rmonats
        };
    }
    // P5 (SUB)
    let $MC = [0, 0, 0, $MCF, $MC1F, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 0, $MC1F + 4, 0];
    // P5 (END)

    // P0 (BACK)
    if ($MC[3] == 1) {
        $MC[3] = $MC[$MC[18]] + 1;                                       // P0LBL3
    }
    // P0LBL4
    if (($MC[4] == 3) || ($MC[4] == 5) || ($MC[4] == 7) || ($MC[4] == 10)) {
        if ($MC[3] < 16) {                                           // P0LBL1
            $MC[0] = 1;
            $MC[3] = $MC[3] + 17;
            if ($MC[3] < 25) {
                $MC[0] = 2;
                $MC[3] = $MC[3] + 8;
            }
        }
    }
    else {
        if ($MC[3] < 14) {                                           // P0LBL2
            $MC[0] = 1;
            $MC[8] = $MC[10] = $MC[13] = $MC[15] = $MC[6] = 31;
            $MC[3] = $MC[3] + 19;
            if ($MC[3] < 25) {
                $MC[0] = 2;
                $MC[3] = $MC[3] + 8;
            }
        }
    }
    // P0LBL9
    $MC[1] = $MC[$MC[18]] + 2 - $MC[3];
    //    print "$MC[0] $MC[1] $MC[2] $MC[3] $MC[4]\n"; 
    let rtag: rtags, rtxt: rtxts, rmonat: rmonats;

    // P1 (SUB)
    if ($MC[1] == 1) {
        rtag = "";                                                    // P1LBL1
        if ($MC[0] == 0) {
            $MC[4]--;                                                // P1LBL4
        }
    }
    else if ($MC[1] == 2) {
        rtag = "pr.";                                                  // P1LBL2
    }
    else {
        let $STR = "a.d.";
        // P6 (SUB)
        $MC[2] = ($MC[1] - ($MC[1] % 10)) / 10;
        //if ($MC[1]>9) {
        //    $MC[2]=1;
        //}
        //else {
        //    $MC[2]=0;
        //}
        // P8 (SUB)
        if ($MC[2] == 1) {
            $STR = $STR + "X";                                         // P8LBL1
        }
        // P8LBL0
        // P8 (END)
        // P6 (BACK)
        // P7 (SUB)
        $MC[2] = $MC[1] % 10;                                            // P8LBL1
        //if ($MC[1]>9) {
        //    $MC[2]=$MC[1]-10;                                        // P8LBL1
        //}
        // P7 (END)
        // P6 (BACK)
        // P9 (SUB)
        let $ZAHL = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", ""];
        $STR = $STR + ($ZAHL[$MC[2] - 1] || '');
        //if ($MC[2]==1) { $STR=$STR . "I"; }                          // P9LBL1
        //else if ($MC[2]==2) { $STR=$STR . "II"; }                      // P9LBL2
        //else if ($MC[2]==3) { $STR=$STR . "III"; }                     // P9LBL3
        //else if ($MC[2]==4) { $STR=$STR . "IV"; }                      // P9LBL4
        //else if ($MC[2]==5) { $STR=$STR . "V"; }                       // P9LBL5
        //else if ($MC[2]==6) { $STR=$STR . "VI"; }                      // P9LBL6
        //else if ($MC[2]==7) { $STR=$STR . "VII"; }                     // P9LBL7
        //else if ($MC[2]==8) { $STR=$STR . "VIII"; }                    // P9LBL8
        //else if ($MC[2]==9) { $STR=$STR . "IX"; }                      // P9LBL9
        // P9LBL0
        // P9 (END)
        // P6 (END)
        // P1 (BACK)
        rtag = $STR + "." as rtags;
    }
    // P1LBL3
    // P1 (END)
    // P0 (BACK)
    // P2 (SUB)
    if ($MC[0] == 0) {
        rtxt = "Kal.";                                          // P2LBL0
        $MC[4]++;
        if ($MC[4] == 13) {
            $MC[4] = 1;                                                // P2LBL4
        }
    }
    else if ($MC[0] == 1) {
        rtxt = "Id.";                                           // P2LBL1
    }
    else if ($MC[0] == 2) {
        rtxt = "Non.";                                          // P2LBL2
    }
    // P2LBL3
    // P2 (END)
    // P0 (BACK)
    // P3 (SUB)
    let $MONAT: rmonats[] = ["Ian.", "Feb.", "Mart.", "Apr.", "Mai.", "Jun.", "Jul.", "Sext.", "Sept.", "Oct.", "Nov.", "Dec."];
    rmonat = $MONAT[$MC[4] - 1];
    //if ($MC[4]==1) { $STR=$STR . "Ian."; }                           // P3LBL1
    //else if ($MC[4]==2) { $STR=$STR . "Feb."; }                        // P3LBL2
    //else if ($MC[4]==3) { $STR=$STR . "Mart."; }                       // P3LBL3
    //else if ($MC[4]==4) { $STR=$STR . "Apr."; }                        // P3LBL4
    //else if ($MC[4]==5) { $STR=$STR . "Mai."; }                        // P3LBL5
    //else if ($MC[4]==6) { $STR=$STR . "Jun."; }                        // P3LBL6
    //else if ($MC[4]==7) { $STR=$STR . "Jul."; }                        // P3LBL7
    // P4 (SUB)
    //else if ($MC[4]==8) { $STR=$STR . "Sext."; }                       // P4LBL1
    //else if ($MC[4]==9) { $STR=$STR . "Sept."; }                       // P4LBL2
    //else if ($MC[4]==10) { $STR=$STR . "Oct."; }                       // P4LBL3
    //else if ($MC[4]==11) { $STR=$STR . "Nov."; }                       // P4LBL4
    //else if ($MC[4]==12) { $STR=$STR . "Dec."; }                       // P4LBL5
    // P4LBL0
    // P4 (END)
    // P3LBL0
    // P3 (END)
    // P0 (BACK)

    return { rtag, rtxt, rmonat };
}

function ryear($year: number) {
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