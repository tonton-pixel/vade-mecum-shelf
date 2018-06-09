const fs = require ('fs');
const path = require ('path');
//
// https://www.unicode.org/Public/5.1.0/ucd/UCD.html
// https://www.unicode.org/reports/tr44/
//
let lines;
//
let versions = [ ];
//
// Copy of https://unicode.org/Public/UNIDATA/DerivedAge.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'DerivedAge.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\d+\.\d+)\s+#/);
        if (found)
        {
            versions.push ({ first: found[1], last: found[2] || found[1], age: found[3] });
        }
    }
}
//
let blocks = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/Blocks.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'Blocks.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})\.\.([0-9a-fA-F]{4,});\s+(.+)$/);
        if (found)
        {
            blocks.push ({ first: found[1], last: found[2], name: found[3] });
        }
    }
}
//
module.exports = { versions, blocks };
//
