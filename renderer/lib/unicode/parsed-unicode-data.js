const fs = require ('fs');
const path = require ('path');
//
// https://www.unicode.org/Public/5.1.0/ucd/UCD.html
// https://www.unicode.org/reports/tr44/
//
let lines;
//
let codePoints = { };
let codePointRanges = { };
//
// Copy of https://www.unicode.org/Public/UNIDATA/UnicodeData.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'UnicodeData.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if (line)
    {
        let fields = line.split (';');
        let codePoint = `U+${fields[0]}`;
        codePoints[codePoint] =
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
        let found;
        if (found = fields[1].match (/^<(.+), First>$/))
        {
            codePointRanges[found[1]] = { first: `U+${fields[0]}` };
        }
        else if (found = fields[1].match (/^<(.+), Last>$/))
        {
            codePointRanges[found[1]].last = `U+${fields[0]}`;
        }
    }
}
//
module.exports = { codePoints, codePointRanges };
//
