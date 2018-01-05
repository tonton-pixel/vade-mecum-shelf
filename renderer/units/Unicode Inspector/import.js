//
const unit = document.getElementById ('unicode-inspector-unit');
//
const inputCharacters = unit.querySelector ('.input-characters');
const outputCodePoints = unit.querySelector ('.output-code-points');
const scalarValues = unit.querySelector ('.scalar-values');
const stringEscapes = unit.querySelector ('.string-escapes');
const upperCaseHex = unit.querySelector ('.upper-case-hex');
//
const inputCodePoints = unit.querySelector ('.input-code-points');
const outputCharacters = unit.querySelector ('.output-characters');
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs =
    {
        inputCharacters: "AaĀā❤愛爱💜",
        stringEscapes: true,
        scalarValues: true,
        upperCaseHex: true,
        inputCodePoints: "\\u{2764}\\u{FE0F}"
    };
    let prefs = getPrefs (defaultPrefs);
    //
    const unicode = require ('./unicode.js');
    //
    inputCharacters.addEventListener
    (
        'input',
        (event) =>
        {
            outputCodePoints.value = unicode.getCodePoints (event.target.value, stringEscapes.checked, scalarValues.checked, upperCaseHex.checked);
        }
    );
    inputCharacters.value = prefs.inputCharacters; inputCharacters.dispatchEvent (new Event ('input'));
    //
    stringEscapes.checked = prefs.stringEscapes; inputCharacters.dispatchEvent (new Event ('input'));
    stringEscapes.addEventListener ('click', (event) => { inputCharacters.dispatchEvent (new Event ('input')); });
    //
    scalarValues.checked = prefs.scalarValues; inputCharacters.dispatchEvent (new Event ('input'));
    scalarValues.addEventListener ('click', (event) => { inputCharacters.dispatchEvent (new Event ('input')); });
    //
    upperCaseHex.checked = prefs.upperCaseHex; inputCharacters.dispatchEvent (new Event ('input'));
    upperCaseHex.addEventListener ('click', (event) => { inputCharacters.dispatchEvent (new Event ('input')); });
    //
    inputCodePoints.addEventListener
    (
        'input',
        (event) =>
        {
            outputCharacters.value = unicode.getCharacters (event.target.value);
        }
    );
    inputCodePoints.value = prefs.inputCodePoints; inputCodePoints.dispatchEvent (new Event ('input'));
};
//
module.exports.stop = function (context, setPrefs)
{
    let prefs =
    {
        inputCharacters: inputCharacters.value,
        stringEscapes: stringEscapes.checked,
        scalarValues: scalarValues.checked,
        upperCaseHex: upperCaseHex.checked,
        inputCodePoints: inputCodePoints.value
    };
    setPrefs (prefs);
};
//
