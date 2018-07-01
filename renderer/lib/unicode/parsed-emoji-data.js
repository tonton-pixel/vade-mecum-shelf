//
const fs = require ('fs');
const path = require ('path');
//
// https://unicode.org/Public/emoji/
//
let lines;
//
// http://unicode.org/reports/tr51#Major_Sources
//
const emojiSources =
{
    "z": "ZDings",      // Zapf Dingbats
    "a": "ARIB",        // Association of Radio Industries and Businesses
    "j": "JCarrier",    // Japanese Carriers
    "w": "WDings",      // Wingdings & Webdings
    "x": "Other"        // Other
};
//
let emojiData_1_0 = { };
//
// Copy of https://unicode.org/Public/emoji/1.0/emoji-data.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '1.0', 'emoji-data.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^V(\d+\.\d+)\s+\((.*)\)\s+(.*)$/);
        if (comments)
        {
            emojiData_1_0[emojiString] =
            {
                code: fields[0].trim (),
                defaultStyle: fields[1].trim (),
                level: parseInt (fields[2].trim ()[1], 10),
                modifierStatus: fields[3].trim (),
                sources: fields[4].trim ().split (' ').map (source => emojiSources[source]),
                age: comments[1],
                name: comments[3]
            }
            // if (comments[2] !== emojiString) console.log ("[1.0/emoji-data.txt] Emoji mismatch:", emojiString);
        }
    }
}
//
let emojiData_2_0 = { };
//
// Copy of https://unicode.org/Public/emoji/2.0/emoji-data.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '2.0', 'emoji-data.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let fields = data.split (';');
        let range = fields[0].trim ();
        let property = fields[1].trim ();
        let found = range.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?$/);
        if (found)
        {
            let first = found[1];
            let last = found[2] || found[1];
            for (let code = parseInt (first, 16); code <= parseInt (last, 16); code++)
            {
                let emojiString = String.fromCodePoint (code);
                if (!(emojiString in emojiData_2_0))
                {
                    let hex = code.toString (16).toUpperCase ();
                    if (hex.length < 5)
                    {
                        hex = ("000" + hex).slice (-4);
                    }
                    emojiData_2_0[emojiString] = { code: hex };
                }
                let data2 = emojiData_2_0[emojiString];
                if (property === "Emoji")
                {
                    data2.emoji = true;
                }
                else if (property === "Emoji_Presentation")
                {
                    data2.emojiPresentation = true;
                }
                else if (property === "Emoji_Modifier")
                {
                    data2.emojiModifier = true;
                }
                else if (property === "Emoji_Modifier_Base")
                {
                    data2.emojiModifierBase = true;
                }
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/2.0/emoji-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '2.0', 'emoji-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let codePoints = data.trim ().split (' ');
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^\((.*)\)\s+(.*)$/);
        if (comments)
        {
            // if (comments[1] !== emojiString) console.log ("[2.0/emoji-sequences.txt] Emoji mismatch:", comments[1], emojiString);
            emojiData_2_0[emojiString] =
            {
                code: data.trim (),
                name: comments[2],
                emojiSequence: true
            };
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/2.0/emoji-zwj-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '2.0', 'emoji-zwj-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let codePoints = data.trim ().split (' ');
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^\((.*)\)\s+(.*)$/);
        if (comments)
        {
            // if (comments[1] !== emojiString) console.log ("[2.0/emoji-zwj-sequences.txt] Emoji mismatch:", comments[1], emojiString);
            emojiData_2_0[emojiString] =
            {
                code: data.trim (),
                name: comments[2],
                emojiZWJSequence: true
            };
        }
    }
}
//
let emojiData_3_0 = { };
//
// Copy of https://unicode.org/Public/emoji/3.0/emoji-data.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '3.0', 'emoji-data.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let range = fields[0].trim ();
        let property = fields[1].trim ();
        let comments = comment.trim ().match (/^(\d+\.\d+)\s*\[\d+\]\s+\(.*\)\s+.*$/);
        let found = range.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?$/);
        if (found)
        {
            let first = found[1];
            let last = found[2] || found[1];
            for (let code = parseInt (first, 16); code <= parseInt (last, 16); code++)
            {
                let emojiString = String.fromCodePoint (code);
                if (!(emojiString in emojiData_3_0))
                {
                    let hex = code.toString (16).toUpperCase ();
                    if (hex.length < 5)
                    {
                        hex = ("000" + hex).slice (-4);
                    }
                    emojiData_3_0[emojiString] = { code: hex, age: comments[1] };
                }
                let data3 = emojiData_3_0[emojiString];
                if (property === "Emoji")
                {
                    data3.emoji = true;
                }
                else if (property === "Emoji_Presentation")
                {
                    data3.emojiPresentation = true;
                }
                else if (property === "Emoji_Modifier")
                {
                    data3.emojiModifier = true;
                }
                else if (property === "Emoji_Modifier_Base")
                {
                    data3.emojiModifierBase = true;
                }
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/3.0/emoji-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '3.0', 'emoji-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let type = fields[1].trim ();
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^(\d+\.\d+)\s+\[\d+\]\s+\((.*)\)\s+(.*)$/);
        if (comments)
        {
            // if (comments[2] !== emojiString) console.log ("[3.0/emoji-sequences.txt] Emoji mismatch:", comments[2], emojiString);
            emojiData_3_0[emojiString] =
            {
                code: fields[0].trim (),
                age: comments[1],
                name: comments[3]
            };
            let data3 = emojiData_3_0[emojiString];
            if (type === "Emoji_Combining_Sequence")
            {
                data3.emojiCombiningSequence = true;
            }
            else if (type === "Emoji_Flag_Sequence")
            {
                data3.emojiFlagSequence = true;
            }
            else if (type === "Emoji_Modifier_Sequence")
            {
                data3.emojiModifierSequence = true;
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/3.0/emoji-zwj-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '3.0', 'emoji-zwj-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let type = fields[1].trim ();
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^(\d+\.\d+)\s+\[\d+\]\s+\((.*)\)\s+(.*)$/);
        if (comments)
        {
            // if (comments[2] !== emojiString) console.log ("[3.0/emoji-zwj-sequences.txt] Emoji mismatch:", comments[2], emojiString);
            emojiData_3_0[emojiString] =
            {
                code: fields[0].trim (),
                age: comments[1],
                name: comments[3]
            };
            let data3 = emojiData_3_0[emojiString];
            if (type === "Emoji_ZWJ_Sequence")
            {
                data3.emojiZWJSequence = true;
            }
        }
    }
}
//
let emojiData_4_0 = { };
//
// Copy of https://unicode.org/Public/emoji/4.0/emoji-data.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '4.0', 'emoji-data.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let range = fields[0].trim ();
        let property = fields[1].trim ();
        let comments = comment.trim ().match (/^(\d+\.\d+)\s*\[\d+\]\s+\(.*\)\s+.*$/);
        let found = range.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?$/);
        if (found)
        {
            let first = found[1];
            let last = found[2] || found[1];
            for (let code = parseInt (first, 16); code <= parseInt (last, 16); code++)
            {
                let emojiString = String.fromCodePoint (code);
                if (!(emojiString in emojiData_4_0))
                {
                    let hex = code.toString (16).toUpperCase ();
                    if (hex.length < 5)
                    {
                        hex = ("000" + hex).slice (-4);
                    }
                    emojiData_4_0[emojiString] = { code: hex, age: comments[1] };
                }
                let data4 = emojiData_4_0[emojiString];
                if (property === "Emoji")
                {
                    data4.emoji = true;
                }
                else if (property === "Emoji_Presentation")
                {
                    data4.emojiPresentation = true;
                }
                else if (property === "Emoji_Modifier")
                {
                    data4.emojiModifier = true;
                }
                else if (property === "Emoji_Modifier_Base")
                {
                    data4.emojiModifierBase = true;
                }
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/4.0/emoji-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '4.0', 'emoji-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        // Specific dirty hack for 'keycap: #' appearing before the actual start-of-comment mark
        if (line.indexOf ('keycap: #') > 0)
        {
            hashOffset = line.indexOf ('#', hashOffset + '#'.length );
        }
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let type = fields[1].trim ();
        let name = fields[2].trim ();
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^(\d+\.\d+)\s+\[\d+\]\s+\((.*)\)$/);
        if (comments)
        {
            // if (comments[2] !== emojiString) console.log ("[4.0/emoji-sequences.txt] Emoji mismatch:", comments[2], emojiString);
            emojiData_4_0[emojiString] =
            {
                code: fields[0].trim (),
                age: comments[1],
                name: name
            };
            let data4 = emojiData_4_0[emojiString];
            if (type === "Emoji_Combining_Sequence")
            {
                data4.emojiCombiningSequence = true;
            }
            else if (type === "Emoji_Flag_Sequence")
            {
                data4.emojiFlagSequence = true;
            }
            else if (type === "Emoji_Modifier_Sequence")
            {
                data4.emojiModifierSequence = true;
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/4.0/emoji-zwj-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '4.0', 'emoji-zwj-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let type = fields[1].trim ();
        let name = fields[2].trim ();
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^(\d+\.\d+)\s+\[\d+\]\s+\((.*)\)$/);
        if (comments)
        {
            // if (comments[2] !== emojiString) console.log ("[4.0/emoji-zwj-sequences.txt] Emoji mismatch:", comments[2], emojiString);
            emojiData_4_0[emojiString] =
            {
                code: fields[0].trim (),
                age: comments[1],
                name: name
            };
            let data4 = emojiData_4_0[emojiString];
            if (type === "Emoji_ZWJ_Sequence")
            {
                data4.emojiZWJSequence = true;
            }
        }
    }
}
//
let emojiData_5_0 = { };
//
// Copy of https://unicode.org/Public/emoji/5.0/emoji-data.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '5.0', 'emoji-data.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let range = fields[0].trim ();
        let property = fields[1].trim ();
        let comments = comment.trim ().match (/^(\d+\.\d+)\s*\[\d+\]\s+\(.*\)\s+.*$/);
        let found = range.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?$/);
        if (found)
        {
            let first = found[1];
            let last = found[2] || found[1];
            for (let code = parseInt (first, 16); code <= parseInt (last, 16); code++)
            {
                let emojiString = String.fromCodePoint (code);
                if (!(emojiString in emojiData_5_0))
                {
                    let hex = code.toString (16).toUpperCase ();
                    if (hex.length < 5)
                    {
                        hex = ("000" + hex).slice (-4);
                    }
                    emojiData_5_0[emojiString] = { code: hex, age: comments[1] };
                }
                let data5 = emojiData_5_0[emojiString];
                if (property === "Emoji")
                {
                    data5.emoji = true;
                }
                else if (property === "Emoji_Presentation")
                {
                    data5.emojiPresentation = true;
                }
                else if (property === "Emoji_Modifier")
                {
                    data5.emojiModifier = true;
                }
                else if (property === "Emoji_Modifier_Base")
                {
                    data5.emojiModifierBase = true;
                }
                else if (property === "Emoji_Component")    // New in 5.0
                {
                    data5.emojiComponent = true;
                }
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/5.0/emoji-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '5.0', 'emoji-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let type = fields[1].trim ();
        let name = fields[2].trim ().replace (/\\x\{([0-9a-fA-F]{1,})\}/g, (match, p1) => { return String.fromCodePoint (parseInt (p1, 16)) });
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^(\d+\.\d+)\s+\[\d+\]\s+\((.*)\)$/);
        if (comments)
        {
            // if (comments[2] !== emojiString) console.log ("[5.0/emoji-sequences.txt] Emoji mismatch:", comments[2], emojiString);
            emojiData_5_0[emojiString] =
            {
                code: fields[0].trim (),
                age: comments[1],
                name: name
            };
            let data5 = emojiData_5_0[emojiString];
            if (type === "Emoji_Keycap_Sequence")    // New in 5.0
            {
                data5.emojiKeycapSequence = true;
            }
            else if (type === "Emoji_Flag_Sequence")
            {
                data5.emojiFlagSequence = true;
            }
            else if (type === "Emoji_Tag_Sequence")    // New in 5.0
            {
                data5.emojiTagSequence = true;
            }
            else if (type === "Emoji_Modifier_Sequence")
            {
                data5.emojiModifierSequence = true;
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/5.0/emoji-variation-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '5.0', 'emoji-variation-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^\((\d+\.\d+)\)\s+(.*)$/);
        if (comments)
        {
            emojiData_5_0[emojiString] =
            {
                code: fields[0].trim (),
                style: fields[1].trim ().split(' ')[0],
                age: comments[1],
                name: comments[2],
                emojiVariationSequence: true
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/5.0/emoji-zwj-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '5.0', 'emoji-zwj-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let type = fields[1].trim ();
        let name = fields[2].trim ().replace (/\\x\{([0-9a-fA-F]{1,})\}/g, (match, p1) => { return String.fromCodePoint (parseInt (p1, 16)) });
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^(\d+\.\d+)\s+\[\d+\]\s+\((.*)\)$/);
        if (comments)
        {
            // if (comments[2] !== emojiString) console.log ("[5.0/emoji-zwj-sequences.txt] Emoji mismatch:", comments[2], emojiString);
            emojiData_5_0[emojiString] =
            {
                code: fields[0].trim (),
                age: comments[1],
                name: name
            };
            let data5 = emojiData_5_0[emojiString];
            if (type === "Emoji_ZWJ_Sequence")
            {
                data5.emojiZWJSequence = true;
            }
        }
    }
}
//
let emojiData_11_0 = { };
//
// Copy of https://unicode.org/Public/emoji/11.0/emoji-data.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '11.0', 'emoji-data.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let range = fields[0].trim ();
        let property = fields[1].trim ();
        let comments = comment.trim ().match (/^(NA|\d+\.\d+)\s*\[\d+\]\s+\(.*\)\s+.*$/);
        let found = range.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?$/);
        if (found)
        {
            let first = found[1];
            let last = found[2] || found[1];
            for (let code = parseInt (first, 16); code <= parseInt (last, 16); code++)
            {
                let emojiString = String.fromCodePoint (code);
                if (!(emojiString in emojiData_11_0))
                {
                    let hex = code.toString (16).toUpperCase ();
                    if (hex.length < 5)
                    {
                        hex = ("000" + hex).slice (-4);
                    }
                    emojiData_11_0[emojiString] = { code: hex, age: comments[1] };
                }
                let data11 = emojiData_11_0[emojiString];
                if (property === "Emoji")
                {
                    data11.emoji = true;
                }
                else if (property === "Emoji_Presentation")
                {
                    data11.emojiPresentation = true;
                }
                else if (property === "Emoji_Modifier")
                {
                    data11.emojiModifier = true;
                }
                else if (property === "Emoji_Modifier_Base")
                {
                    data11.emojiModifierBase = true;
                }
                else if (property === "Emoji_Component")    // New in 5.0
                {
                    data11.emojiComponent = true;
                }
                else if (property === "Extended_Pictographic")    // New in 11.0
                {
                    data11.extendedPictographic = true;
                }
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/11.0/emoji-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '11.0', 'emoji-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let type = fields[1].trim ();
        let name = fields[2].trim ().replace (/\\x\{([0-9a-fA-F]{1,})\}/g, (match, p1) => { return String.fromCodePoint (parseInt (p1, 16)) });
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^(\d+\.\d+)\s+\[\d+\]\s+\((.*)\)$/);
        if (comments)
        {
            // if (comments[2] !== emojiString) console.log ("[11.0/emoji-sequences.txt] Emoji mismatch:", comments[2], emojiString);
            emojiData_11_0[emojiString] =
            {
                code: fields[0].trim (),
                age: comments[1],
                name: name
            };
            let data11 = emojiData_11_0[emojiString];
            if (type === "Emoji_Keycap_Sequence")    // New in 5.0
            {
                data11.emojiKeycapSequence = true;
            }
            else if (type === "Emoji_Flag_Sequence")
            {
                data11.emojiFlagSequence = true;
            }
            else if (type === "Emoji_Tag_Sequence")    // New in 5.0
            {
                data11.emojiTagSequence = true;
            }
            else if (type === "Emoji_Modifier_Sequence")
            {
                data11.emojiModifierSequence = true;
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/11.0/emoji-variation-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '11.0', 'emoji-variation-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^\((\d+\.\d+)\)\s+(.*)$/);
        if (comments)
        {
            emojiData_11_0[emojiString] =
            {
                code: fields[0].trim (),
                style: fields[1].trim ().split(' ')[0],
                age: comments[1],
                name: comments[2],
                emojiVariationSequence: true
            }
        }
    }
}
//
// Copy of https://unicode.org/Public/emoji/11.0/emoji-zwj-sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', '11.0', 'emoji-zwj-sequences.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let hashOffset = line.indexOf ('#');
        let data = line.substring (0, hashOffset);
        let comment = line.substring (hashOffset + '#'.length);
        let fields = data.split (';');
        let codePoints = fields[0].trim ().split (' ');
        let type = fields[1].trim ();
        let name = fields[2].trim ().replace (/\\x\{([0-9a-fA-F]{1,})\}/g, (match, p1) => { return String.fromCodePoint (parseInt (p1, 16)) });
        let emojiString = "";
        for (let codePoint of codePoints)
        {
            emojiString += String.fromCodePoint (parseInt (codePoint, 16));
        }
        let comments = comment.trim ().match (/^(\d+\.\d+)\s+\[\d+\]\s+\((.*)\)$/);
        if (comments)
        {
            // if (comments[2] !== emojiString) console.log ("[11.0/emoji-zwj-sequences.txt] Emoji mismatch:", comments[2], emojiString);
            emojiData_11_0[emojiString] =
            {
                code: fields[0].trim (),
                age: comments[1],
                name: name
            };
            let data11 = emojiData_11_0[emojiString];
            if (type === "Emoji_ZWJ_Sequence")
            {
                data11.emojiZWJSequence = true;
            }
        }
    }
}
//
module.exports =
{
    "1.0": emojiData_1_0,
    "2.0": emojiData_2_0,
    "3.0": emojiData_3_0,
    "4.0": emojiData_4_0,
    "5.0": emojiData_5_0,
    "11.0": emojiData_11_0
};
//
