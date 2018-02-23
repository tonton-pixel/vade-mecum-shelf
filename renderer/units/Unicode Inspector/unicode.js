//
const fs = require ('fs');
const path = require ('path');
//
let blocks = [ ];
let computedRanges = { };
let unicodeData = { };
//
// https://www.unicode.org/Public/5.1.0/ucd/UCD.html
// https://www.unicode.org/reports/tr44/
//
let lines;
//
// Copy of https://www.unicode.org/Public/UNIDATA/Blocks.txt
lines = fs.readFileSync (path.join (__dirname, 'Blocks.txt')).toString ().split ('\n');
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
// Copy of https://www.unicode.org/Public/UNIDATA/UnicodeData.txt
lines = fs.readFileSync (path.join (__dirname, 'UnicodeData.txt')).toString ().split ('\n');
for (let line of lines)
{
    if (line)
    {
        let fields = line.split (';');
        unicodeData[fields[0]] =
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
            old: fields[10],
            comment: fields[11],
            uppercase: fields[12],
            lowercase: fields[13],
            titlecase: fields[14]
        };
        let found;
        if (found = fields[1].match (/^<(.+), First>$/))
        {
            computedRanges[found[1]] = { code: fields[0] };
            computedRanges[found[1]].first = parseInt (fields[0], 16);
        }
        else if (found = fields[1].match (/^<(.+), Last>$/))
        {
            computedRanges[found[1]].last = parseInt (fields[0], 16);
        }
    }
}
//
const planes =
[
    { name: "Basic Multilingual Plane (BMP)", first: "0000", last: "FFFF" },
    { name: "Supplementary Multilingual Plane (SMP)", first: "10000", last: "1FFFF" },
    { name: "Supplementary Ideographic Plane (SIP)", first: "20000", last: "2FFFF" },
    { name: "Tertiary Ideographic Plane (TIP)", first: "30000", last: "3FFFF" },
    // { name: "Unassigned", first: "40000", last: "DFFFF" },
    { name: "Supplementary Special-purpose Plane (SSP)", first: "E0000", last: "EFFFF" },
    { name: "Supplementary Private Use Area-A", first: "F0000", last: "FFFFF" },
    { name: "Supplementary Private Use Area-B", first: "100000", last: "10FFFF" }
];
//
const categories =
{
    "Lu": "Uppercase Letter",           // an uppercase letter
    "Ll": "Lowercase Letter",           // a lowercase letter
    "Lt": "Titlecase Letter",           // a digraphic character, with first part uppercase
    "Lm": "Modifier Letter",            // a modifier letter
    "Lo": "Other Letter",               // other letters, including syllables and ideographs
    "Mn": "Non-Spacing Mark",           // a nonspacing combining mark (zero advance width)
    "Mc": "Spacing Mark",               // a spacing combining mark (positive advance width)
    "Me": "Enclosing Mark",             // an enclosing combining mark
    "Nd": "Decimal Number",             // a decimal digit
    "Nl": "Letter Number",              // a letterlike numeric character
    "No": "Other Number",               // a numeric character of other type
    "Pc": "Connector Punctuation",      // a connecting punctuation mark, like a tie
    "Pd": "Dash Punctuation",           // a dash or hyphen punctuation mark
    "Ps": "Open Punctuation",           // an opening punctuation mark (of a pair)
    "Pe": "Close Punctuation",          // a closing punctuation mark (of a pair)
    "Pi": "Initial Punctuation",        // an initial quotation mark
    "Pf": "Final Punctuation",          // a final quotation mark
    "Po": "Other Punctuation",          // a punctuation mark of other type
    "Sm": "Math Symbol",                // a symbol of mathematical use
    "Sc": "Currency Symbol",            // a currency sign
    "Sk": "Modifier Symbol",            // a non-letterlike modifier symbol
    "So": "Other Symbol",               // a symbol of other type
    "Zs": "Space Separator",            // a space character (of various non-zero widths)
    "Zl": "Line Separator",             // U+2028 LINE SEPARATOR only
    "Zp": "Paragraph Separator",        // U+2029 PARAGRAPH SEPARATOR only
    "Cc": "Control",                    // a C0 or C1 control code
    "Cf": "Format",                     // a format control character
    "Cs": "Surrogate",                  // a surrogate code point
    "Co": "Private Use",                // a private-use character
    "Cn": "Unassigned",                 // a reserved unassigned code point or a noncharacter (no characters in the file have this property)
    //
    "LC": "Cased Latter",               // Lu | Ll | Lt
    "L": "Letter",                      // Lu | Ll | Lt | Lm | Lo
    "M": "Mark",                        // Mn | Mc | Me
    "N": "Number",                      // Nd | Nl | No
    "P": "Punctuation",                 // Pc | Pd | Ps | Pe | Pi | Pf | Po
    "S": "Symbol",                      // Sm | Sc | Sk | So
    "Z": "Separator",                   // Zs | Zl | Zp
    "C": "Other"                        // Cc | Cf | Cs | Co | Cn
};
//
// Fixed position classes:
// https://www.unicode.org/Public/UNIDATA/extracted/DerivedCombiningClass.txt
const combiningClasses =
{
    "0": "Not Reordered",           // Spacing and enclosing marks; also many vowel and consonant signs, even if nonspacing
    "1": "Overlay",                 // Marks which overlay a base letter or symbol
    "7": "Nukta",                   // Diacritic nukta marks in Brahmi-derived scripts
    "8": "Kana Voicing",            // Hiragana/Katakana voicing marks
    "9": "Virama",                  // Viramas
    //
    "10": "CCC10",
    "11": "CCC11",
    "12": "CCC12",
    "13": "CCC13",
    "14": "CCC14",
    "15": "CCC15",
    "16": "CCC16",
    "17": "CCC17",
    "18": "CCC18",
    "19": "CCC19",
    "20": "CCC20",
    "21": "CCC21",
    "22": "CCC22",
    "23": "CCC23",
    "24": "CCC24",
    "25": "CCC25",
    "26": "CCC26",
    "27": "CCC28",
    "29": "CCC29",
    "30": "CCC30",
    "31": "CCC31",
    "32": "CCC32",
    "33": "CCC33",
    "34": "CCC34",
    "35": "CCC35",
    "36": "CCC36",
    "84": "CCC84",
    "91": "CCC91",
    "103": "CCC103",
    "107": "CCC107",
    "118": "CCC118",
    "122": "CCC122",
    "129": "CCC129",
    "130": "CCC130",
    "132": "CCC132",
    //
    "200": "Attached Below Left",   // Marks attached at the bottom left
    "202": "Attached Below",        // Marks attached directly below
    "204": "Attached Below Right",  // Marks attached at the bottom right
    "208": "Attached Left",         // Marks attached to the left
    "210": "Attached Right",        // Marks attached to the right
    "212": "Attached Above Left",   // Marks attached at the top left
    "214": "Attached Above",        // Marks attached directly above
    "216": "Attached Above Right",  // Marks attached at the top right
    "218": "Below Left",            // Distinct marks at the bottom left
    "220": "Below",                 // Distinct marks directly below
    "222": "Below Right",           // Distinct marks at the bottom right
    "224": "Left",                  // Distinct marks to the left
    "226": "Right",                 // Distinct marks to the right
    "228": "Above Left",            // Distinct marks at the top left
    "230": "Above",                 // Distinct marks directly above
    "232": "Above Right",           // Distinct marks at the top right
    "233": "Double Below",          // Distinct marks subtending two bases
    "234": "Double Above",          // Distinct marks extending above two bases
    "240": "Iota Subscript"         // Greek iota subscript only
};
//
const bidirectionalClasses =
{
    "L": "Left-to-Right",               // any strong left-to-right character
    "LRE": "Left-to-Right Embedding",   // U+202A: the LR embedding control
    "LRO": "Left-to-Right Override",    // U+202D: the LR override control
    "R": "Right-to-Left",               // any strong right-to-left (non-Arabic-type) character
    "AL": "Right-to-Left Arabic",       // any strong right-to-left (Arabic-type) character
    "RLE": "Right-to-Left Embedding",   // U+202B: the RL embedding control
    "RLO": "Right-to-Left Override",    // U+202E: the RL override control
    "PDF": "Pop Directional Format",    // U+202C: terminates an embedding or override control
    "EN": "European Number",            // any ASCII digit or Eastern Arabic-Indic digit
    "ES": "European Number Separator",  // plus and minus signs
    "ET": "European Number Terminator", // a terminator in a numeric format context, includes currency signs
    "AN": "Arabic Number",              // any Arabic-Indic digit
    "CS": "Common Number Separator",    // commas, colons, and slashes
    "NSM": "Non-Spacing Mark",          // any nonspacing mark
    "BN": "Boundary Neutral",           // most format characters, control codes, or noncharacters
    "B": "Paragraph Separator",         // various newline characters
    "S": "Segment Separator",           // various segment-related control codes
    "WS": "Whitespace",                 // spaces
    "ON": "Other Neutrals",             // most other symbols and punctuation marks
    //
    "LRI": "Left-to-Right Isolate",     // U+2066: the LR isolate control
    "RLI": "Right-to-Left Isolate",     // U+2067: the RL isolate control
    "FSI": "First Strong Isolate ",     // U+2068: the first strong isolate control
    "PDI": "Pop Directional Isolate"    // U+2069: terminates an isolate control
};
//
const mirrored =
{
    "N": "",    // Skip field if "No"...
    "Y": "Yes"
}
//
function uniHexify (string)
{
    return string.replace (/\b([0-9a-fA-F]{4,})\b/g, "U\+$&");
}
//
function charToUtf16Code (char)
{
    let utf16Code = "";
    let num = char.codePointAt (0);
    if (num > 0xFFFF)
    {
        let highHex = char.charCodeAt (0).toString (16).toUpperCase ();
        let lowHex = char.charCodeAt (1).toString (16).toUpperCase ();
        highHex = ("000" + highHex).slice (-4);
        lowHex = ("000" + lowHex).slice (-4);
        utf16Code = `${highHex}\xA0${lowHex}`;
    }
    else
    {
        let hex = num.toString (16).toUpperCase ();
        hex = ("000" + hex).slice (-4);
        utf16Code = hex;
    }
    return utf16Code;
}
//
// https://kev.inburke.com/kevin/node-js-string-encoding/
function charToUtf8Code (char)
{
    let utf8Code = [ ];
    let buffer = Buffer.from (char, 'utf8');
    for (let byte of buffer)
    {
        utf8Code.push (("00" + byte.toString (16).toUpperCase ()).slice (-2));
    }
    return utf8Code.join ('\xA0');
}
//
function charToDecimalEntity (char)
{
    return `&#${char.codePointAt (0)};`;
}
//
function charToJavaScriptEscape (char)
{
    let escape = "";
    let num = char.codePointAt (0);
    if (num > 0xFFFF)
    {
        let highHex = char.charCodeAt (0).toString (16).toUpperCase ();
        let lowHex = char.charCodeAt (1).toString (16).toUpperCase ();
        highHex = ("000" + highHex).slice (-4);
        lowHex = ("000" + lowHex).slice (-4);
        escape = `\\u${highHex}\\u${lowHex}`;
    }
    else
    {
        let hex = num.toString (16).toUpperCase ();
        hex = ("000" + hex).slice (-4);
        escape = `\\u${hex}`;
    }
    return escape;
}
//
function charToEcmaScriptEscape (char)
{
    let num = char.codePointAt (0);
    let hex = num.toString (16).toUpperCase ();
    return `\\u{${hex}}`;
}
//
function getCharacterData (char)
{
    let data = { };
    data.character = char;
    data.utf16 = charToUtf16Code (char);
    data.utf8 = charToUtf8Code (char);
    data.entity = charToDecimalEntity (char)
    data.javaScript = charToJavaScriptEscape (char, true);
    data.ecmaScript = charToEcmaScriptEscape (char, true);
    let num = char.codePointAt (0);
    let hex =  num.toString (16).toUpperCase ();
    if (hex.length < 5)
    {
        hex = ("000" + hex).slice (-4);
    }
    data.codePoint = `U+${hex}`;
    for (let plane of planes)
    {
        if ((parseInt (plane.first, 16) <= num) && (num <= parseInt (plane.last, 16)))
        {
            data.planeName = plane.name;
            data.planeRange = uniHexify (plane.first + " - " + plane.last);
            break;
        }
    }
    for (let block of blocks)
    {
        if ((parseInt (block.first, 16) <= num) && (num <= parseInt (block.last, 16)))
        {
            data.blockName = block.name;
            data.blockRange = uniHexify (block.first + " - " + block.last);
            break;
        }
    }
    let name = "";
    let decomposition = "";
    let code = hex;
    for (let range in computedRanges)
    {
        if (computedRanges.hasOwnProperty (range))
        {
            if ((computedRanges[range].first <= num) && (num <= computedRanges[range].last))
            {
                if (range === "Hangul Syllable")
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
                    let s = num - computedRanges[range].first;
                    let n = jamoMedials.length * jamoFinals.length;
                    let t = jamoFinals.length;
                    let i = Math.floor (s / n);
                    let m = Math.floor ((s % n) / t);
                    let f = Math.floor (s % t);
                    name = range.toUpperCase () + " " + jamoInitials[i] + jamoMedials[m] + jamoFinals[f];
                    decomposition =
                        (0x1100 + i).toString (16).toUpperCase () + " " +
                        (0x1161 + m).toString (16).toUpperCase () +
                        (f > 0 ? " " + (0x11A7 + f).toString (16).toUpperCase () : "");
                }
                else
                {
                    name = range.toUpperCase () + "-" + hex;
                }
                code = computedRanges[range].code;
                break;
            }
        }
    }
    if (unicodeData[code])
    {
        data.name = name || unicodeData[code].name;
        data.category = categories[unicodeData[code].category];
        data.combining = combiningClasses[unicodeData[code].combining];
        data.bidirectional = bidirectionalClasses[unicodeData[code].bidirectional];
        data.decomposition = uniHexify (decomposition || unicodeData[code].decomposition);
        data.decimal = unicodeData[code].decimal;
        data.digit = unicodeData[code].digit;
        data.numeric = unicodeData[code].numeric;
        data.mirrored = mirrored[unicodeData[code].mirrored];
        data.old = unicodeData[code].old;
        data.comment = unicodeData[code].comment;
        data.uppercase = uniHexify (unicodeData[code].uppercase);
        data.lowercase = uniHexify (unicodeData[code].lowercase);
        data.titlecase = uniHexify (unicodeData[code].titlecase);
    }
    return data;
}
//
module.exports.stringToDataList = function (string)
{
    let dataList = [ ];
    for (let char of string)
    {
        dataList.push (getCharacterData (char));
    }
    return dataList;
}
//
module.exports.charactersToCodePoints = function (characters)
{
    let codePoints = [ ];
    for (let char of characters)
    {
        let num = char.codePointAt (0);
        let hex =  num.toString (16).toUpperCase ();
        if (hex.length < 5)
        {
            hex = ("000" + hex).slice (-4);
        }
        codePoints.push (`U+${hex}`);
    }
    return codePoints.join (' ');
};
//
module.exports.codePointsToCharacters = function (codePoints)
{
    let characters = "";
    const regex = /\b([0-9a-fA-F]{4,})\b|\\u([0-9a-fA-F]{4})|\\u\{([0-9a-fA-F]{1,})\}|U\+([0-9a-fA-F]{4,})/g;    // Global flag /g *must* be set!
    let hex;
    while ((hex = regex.exec (codePoints)))
    {
        let num = parseInt (hex[1] || hex[2] || hex[3] || hex[4], 16);
        if (num <= 0x10FFFF)
        {
            characters += String.fromCodePoint (num);
        }
    }
    return characters;
};
//
