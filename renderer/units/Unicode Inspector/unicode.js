//
module.exports.getCodePoints = function (string, stringEscapes, scalarValues, upperCaseHex)
{
    let codeArray = [ ];
    for (let char of string)
    {
        let num = char.codePointAt (0);
        if (scalarValues)
        {
            let hex = num.toString (16);
            if (upperCaseHex)
            {
                hex = hex.toUpperCase ();
            }
            if ((!stringEscapes) && (hex.length < 5))
            {
                hex = ("000" + hex).slice (-4);
            }
            codeArray.push (stringEscapes ? `\\u{${hex}}` : `U+${hex}`);
        }
        else
        {
            if (num > 0xFFFF)
            {
                let highHex = char.charCodeAt (0).toString (16);
                let lowHex = char.charCodeAt (1).toString (16);
                if (upperCaseHex)
                {
                    highHex = highHex.toUpperCase ();
                    lowHex = lowHex.toUpperCase ();
                }
                highHex = ("000" + highHex).slice (-4);
                lowHex = ("000" + lowHex).slice (-4);
                codeArray.push (stringEscapes ? `\\u${highHex}\\u${lowHex}` : `U+${highHex} U+${lowHex}`);
            }
            else
            {
                let hex = num.toString (16);
                if (upperCaseHex)
                {
                    hex = hex.toUpperCase ();
                }
                hex = ("000" + hex).slice (-4);
                codeArray.push (stringEscapes ? `\\u${hex}` : `U+${hex}`);
            }
        }
    }
    return codeArray.join (stringEscapes ? "" : " ");
};
//
module.exports.getCharacters = function (string)
{
    let characters = "";
    const regex = /\\u([0-9a-fA-F]{4})|\\u\{([0-9a-fA-F]{1,})\}|U\+([0-9a-fA-F]{4,})/g;    // Global flag /g *must* be set!
    let hex;
    while ((hex = regex.exec (string)))
    {
        let num = parseInt (hex[1] || hex[2] || hex[3], 16);
        if (num <= 0x10FFFF)
        {
            characters += String.fromCodePoint (num);
        }
    }
    return characters;
};
//
