//
const unit = document.getElementById ('roman-numerals-unit');
//
const romanInput = unit.querySelector ('.roman-input');
const romanSample = unit.querySelector ('.roman-sample');
const arabicOutput = unit.querySelector ('.arabic-output');
//
const arabicInput = unit.querySelector ('.arabic-input');
const arabicSample = unit.querySelector ('.arabic-sample');
const romanOutput = unit.querySelector ('.roman-output');
//
const notes = unit.querySelector ('.notes');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        romanInput: "",
        arabicInput: "",
        notes: true,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const numerals = require ('./numerals.js');
    //
    romanSample.textContent = "MMXVIII";
    arabicOutput.value = numerals.romanToArabic (romanInput.value = prefs.romanInput);
    romanInput.addEventListener ('input', (event) => { arabicOutput.value = numerals.romanToArabic (event.currentTarget.value); });
    //
    arabicSample.textContent = "2018";
    romanOutput.value = numerals.arabicToRoman (arabicInput.value = prefs.arabicInput);
    arabicInput.addEventListener ('input', (event) => { romanOutput.value = numerals.arabicToRoman (event.currentTarget.value) });
    //
    notes.open = prefs.notes;
    //
    references.open = prefs.references;
    //
    const refLinks = require ('./ref-links.json');
    const linksList = require ('../../lib/links-list.js');
    //
    linksList (links, refLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        romanInput: romanInput.value,
        arabicInput: arabicInput.value,
        notes: notes.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
