//
const unit = document.getElementById ('iso-script-codes-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const codesContainer = unit.querySelector ('.codes-container');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        liveSearch: "",
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const keyIndex = require ('../../lib/key-index.js');
    const tables = require ('../../lib/tables.js');
    //
    const codes = require ('./codes.json');
    //
    const codeIndex = keyIndex.build (codes, 'code', (a, b) => a.localeCompare (b));
    const englishIndex = keyIndex.build (codes, 'english', (a, b) => a.localeCompare (b, 'en'));
    const frenchIndex = keyIndex.build (codes, 'french', (a, b) => a.localeCompare (b, 'fr'));
    //
    let table = tables.create
    (
        [
            { label: "Code", className: 'code', key: 'code' },
            { label: "English", className: 'language', key: 'english', lang: 'en' },
            { label: "Français", className: 'language', key: 'french', lang: 'fr' }
        ],
        { label: "No Match", className: 'message', lang: 'en' },
        codes,
        codeIndex // Temp...
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
    liveSearch.addEventListener ('input', (event) => { doSearch (event.currentTarget.value); });
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
        liveSearch: liveSearch.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
