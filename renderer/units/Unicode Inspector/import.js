//
const unit = document.getElementById ('unicode-inspector-unit');
//
const inputCharacters = unit.querySelector ('.input-characters');
const outputCodes = unit.querySelector ('.output-codes');
const codePoints = unit.querySelector ('.code-points');
const stringEscapes = unit.querySelector ('.string-escapes');
const upperCaseHex = unit.querySelector ('.upper-case-hex');
//
const inputCodes = unit.querySelector ('.input-codes');
const outputCharacters = unit.querySelector ('.output-characters');
//
function getCodes (string, stringEscapes, codePoints, upperCaseHex)
{
    let codeArray = [ ];
    for (let char of string)
    {
        let num = char.codePointAt (0);
        if (codePoints)
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
}
//
function getCharacters (string)
{
    let characters = "";
    const regex = /\\u([0-9a-fA-F]{4})|\\u\{([0-9a-fA-F]{1,})\}|U\+([0-9a-fA-F]{4,5})/g;    // *Must* be global!
    let hex;
    while ((hex = regex.exec (string)))
    {
        characters += String.fromCodePoint (parseInt (hex[1] || hex[2] || hex[3], 16));
    }
    return characters;
}
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs =
    {
        inputCharacters: "AaĀā❤愛爱💜",
        stringEscapes: true,
        codePoints: true,
        upperCaseHex: true,
        inputCodes: "\\u{2764}\\u{FE0F}"
    };
    let prefs = getPrefs (defaultPrefs);
    //
    inputCharacters.addEventListener
    (
        'input',
        (event) =>
        {
            outputCodes.value = getCodes (event.target.value, stringEscapes.checked, codePoints.checked, upperCaseHex.checked);
       }
    );
    inputCharacters.value = prefs.inputCharacters; inputCharacters.dispatchEvent (new Event ('input'));
    //
    stringEscapes.checked = prefs.stringEscapes; inputCharacters.dispatchEvent (new Event ('input'));
    stringEscapes.addEventListener ('click', (event) => { inputCharacters.dispatchEvent (new Event ('input')); });
    //
    codePoints.checked = prefs.codePoints; inputCharacters.dispatchEvent (new Event ('input'));
    codePoints.addEventListener ('click', (event) => { inputCharacters.dispatchEvent (new Event ('input')); });
    //
    upperCaseHex.checked = prefs.upperCaseHex; inputCharacters.dispatchEvent (new Event ('input'));
    upperCaseHex.addEventListener ('click', (event) => { inputCharacters.dispatchEvent (new Event ('input')); });
    //
    inputCodes.addEventListener
    (
        'input',
        (event) =>
        {
            outputCharacters.value = getCharacters (event.target.value);
       }
    );
    inputCodes.value = prefs.inputCodes; inputCodes.dispatchEvent (new Event ('input'));
}
//
module.exports.stop = function (context, setPrefs)
{
    let prefs =
    {
        inputCharacters: inputCharacters.value,
        stringEscapes: stringEscapes.checked,
        codePoints: codePoints.checked,
        upperCaseHex: upperCaseHex.checked,
        inputCodes: inputCodes.value
    };
    setPrefs (prefs);
}
//
