const fs = require ('fs');
const path = require ('path');
//
// https://www.unicode.org/Public/5.1.0/ucd/UCD.html
// https://www.unicode.org/reports/tr44/
//
let lines;
//
let codePoints = { };
//
let first;
let last;
let rangeName;
//
// Copy of https://www.unicode.org/Public/UNIDATA/UnicodeData.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'UnicodeData.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if (line)
    {
        let fields = line.split (';');
        let found;
        if (found = fields[1].match (/^<(.+), First>$/))
        {
            first = parseInt (fields[0], 16);
            rangeName = found[1];
        }
        else if (found = fields[1].match (/^<(.+), Last>$/))
        {
            last = parseInt (fields[0], 16);
            if (rangeName !== found[1]) console.log ("[UnicodeData] rangeName mismatch:", rangeName, found[1]);
            for (let num = first; num <= last; num++)
            {
                let hex = num.toString (16).toUpperCase ();
                if (hex.length < 5)
                {
                    hex = ("000" + hex).slice (-4);
                }
                let name = "";
                let decomposition = "";
                if (rangeName === "Hangul Syllable")
                {
                    // "Hangul" in "UTR #15: Unicode Normalization Forms"
                    // https://unicode.org/reports/tr15/tr15-33.html#Hangul
                    // "Conjoining Jamo Behavior" in "The Unicode Standard, Version 10.0 - ch03.pdf" p. 143
                    // https://www.unicode.org/versions/Unicode10.0.0/ch03.pdf
                    let jamoInitials =
                    [
                        "G", "GG", "N", "D", "DD", "R", "M", "B", "BB",
                        "S", "SS", "", "J", "JJ", "C", "K", "T", "P", "H"
                    ];
                    let jamoMedials =
                    [
                        "A", "AE", "YA", "YAE", "EO", "E", "YEO", "YE", "O",
                        "WA", "WAE", "OE", "YO", "U", "WEO", "WE", "WI",
                        "YU", "EU", "YI", "I"
                    ];
                    let jamoFinals =
                    [
                        "", "G", "GG", "GS", "N", "NJ", "NH", "D", "L", "LG", "LM",
                        "LB", "LS", "LT", "LP", "LH", "M", "B", "BS",
                        "S", "SS", "NG", "J", "C", "K", "T", "P", "H"
                    ];
                    let s = num - first;
                    let n = jamoMedials.length * jamoFinals.length;
                    let t = jamoFinals.length;
                    let i = Math.floor (s / n);
                    let m = Math.floor ((s % n) / t);
                    let f = Math.floor (s % t);
                    name = rangeName.toUpperCase () + " " + jamoInitials[i] + jamoMedials[m] + jamoFinals[f];
                    decomposition =
                        (0x1100 + i).toString (16).toUpperCase () + " " +
                        (0x1161 + m).toString (16).toUpperCase () +
                        (f > 0 ? " " + (0x11A7 + f).toString (16).toUpperCase () : "");
                }
                else
                {
                    name = rangeName.toUpperCase () + "-" + hex;
                }
                codePoints[`U+${hex}`] =
                {
                    code: hex,
                    name: name,
                    category: fields[2],
                    combining: fields[3],
                    bidirectional: fields[4],
                    decomposition: decomposition || fields[5],
                    decimal: fields[6],
                    digit: fields[7],
                    numeric: fields[8],
                    mirrored: fields[9],
                    alias: fields[10],
                    comment: fields[11],
                    uppercase: fields[12],
                    lowercase: fields[13],
                    titlecase: fields[14]
                };
            }
        }
        else
        {
            codePoints[`U+${fields[0]}`] =
            {
                code: fields[0],
                name: fields[1],
                category: fields[2],
                combining: fields[3],
                bidirectional: fields[4],
                decomposition: fields[5],
                decimal: fields[6],
                digit: fields[7],
                numeric: fields[8],
                mirrored: fields[9],
                alias: fields[10],
                comment: fields[11],
                uppercase: fields[12],
                lowercase: fields[13],
                titlecase: fields[14]
            };
        }
    }
}
//
// Copy of https://www.unicode.org/Public/UNIDATA/NameAliases.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'NameAliases.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let fields = line.split (';');
        let hex = fields[0];
        let alias = fields[1];
        let type = fields[2];
        if (type === "correction")
        {
            codePoints[`U+${hex}`].correction = alias;
        }
    }
}
//
module.exports = codePoints;
//
