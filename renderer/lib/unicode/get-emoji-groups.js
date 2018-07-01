//
const fs = require ('fs');
const path = require ('path');
//
// https://unicode.org/Public/emoji/
//
// Copy of https://unicode.org/Public/emoji/4.0/emoji-test.txt
// Copy of https://unicode.org/Public/emoji/5.0/emoji-test.txt
// Copy of https://unicode.org/Public/emoji/11.0/emoji-test.txt
//
module.exports = function (version)
{
    let result = [ ];
    let lines = fs.readFileSync (path.join (__dirname, 'emoji', version, 'emoji-test.txt'), { encoding: 'utf8' }).split ('\n');
    let groupName = "";
    let subgroupName = "";
    let matchFound;
    let subgroups;
    let characters;
    for (let line of lines)
    {
        if (line)
        {
            if (matchFound = line.match (/^# group: (.*)$/))
            {
                if (subgroupName)
                {
                    subgroups.push ({ name: subgroupName, characters: characters });
                }
                if (groupName)
                {
                    result.push ({ name: groupName, subgroups: subgroups });
                }
                groupName = matchFound[1];
                subgroups = [ ];
                subgroupName = "";
            }
            else if (matchFound = line.match (/^# subgroup: (.*)$/))
            {
                if (subgroupName)
                {
                    subgroups.push ({ name: subgroupName, characters: characters });
                }
                subgroupName = matchFound[1].replace (/\b\w/g, (m) => m.toUpperCase ()).replace ("-", " | ").replace (/\bav\b/i, "AV");
                characters = [ ];
            }
            else if (matchFound = line.match (/^#EOF$/))
            {
                if (subgroupName)
                {
                    subgroups.push ({ name: subgroupName, characters: characters });
                }
                if (groupName)
                {
                    result.push ({ name: groupName, subgroups: subgroups });
                }
            }
            else if (matchFound = line.match (/^#/))
            {
                // Ignore any other non-structured comments
            }
            else
            {
                let hashOffset = line.indexOf ('#');
                let data = line.substring (0, hashOffset);
                let fields = data.split (';');
                let codePoints = fields[0].trim ().split (' ');
                let status = fields[1].trim ();
                if (status === "fully-qualified")
                {
                    let emojiString = "";
                    for (let codePoint of codePoints)
                    {
                        emojiString += String.fromCodePoint (parseInt (codePoint, 16));
                    }
                    characters.push (emojiString);
                }
            }
        }
    }
    return result;
};
//
