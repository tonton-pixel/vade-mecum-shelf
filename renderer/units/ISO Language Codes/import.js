//
const unit = document.getElementById ('iso-language-codes-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const codesContainer = unit.querySelector ('.codes-container');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        liveSearch: ""
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const tables = require ('../../lib/tables.js');
    //
    const codes = require ('./codes.json');
    //
    const code1Index = tables.buildKeyIndex (codes, "639-1", (a, b) => a.localeCompare (b));
    const code2Index = tables.buildKeyIndex (codes, "639-2", (a, b) => a.localeCompare (b));
    const englishIndex = tables.buildKeyIndex (codes, "english", (a, b) => a.localeCompare (b, 'en'));
    const frenchIndex = tables.buildKeyIndex (codes, "french", (a, b) => a.localeCompare (b, 'fr'));
    //
    let table = tables.create
    (
        [
            { label: "639-1", className: 'code', key: "639-1" },
            { label: "639-2", className: 'code', key: "639-2" },
            { label: "English", className: 'language', key: "english", lang: 'en' },
            { label: "Français", className: 'language', key: "french", lang: 'fr' }
        ],
        { label: "No Match", className: 'message', lang: 'en' },
        codes,
        code1Index // Temp...
    );
    //
    let tableCopy = table.cloneNode (true);
    codesContainer.appendChild (tableCopy);
    //
    function doSearch (string)
    {
        tableCopy.remove ();
        tableCopy = table.cloneNode (true);
        let matchingRowCount = tables.searchData (tableCopy, string);
        if (matchingRowCount === 0)
        {
            tableCopy.querySelector ('tr[hidden]').removeAttribute ('hidden');
        }
        codesContainer.appendChild (tableCopy);
    }
    //
    liveSearch.placeholder = "Search";
    doSearch (liveSearch.value = prefs.liveSearch);
    liveSearch.addEventListener ('input', (event) => { doSearch (event.target.value); });
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        liveSearch: liveSearch.value
    };
    context.setPrefs (prefs);
};
//
