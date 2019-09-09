//
const unit = document.getElementById ('chemical-elements-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const codesContainer = unit.querySelector ('.codes-container');
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
        liveSearch: "",
        notes: true,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const keyIndex = require ('../../lib/key-index.js');
    const tables = require ('../../lib/tables.js');
    //
    const elements = require ('./elements.json');
    //
    const atomicNumberIndex = keyIndex.build (elements, 'atomic-number', (a, b) => a - b);
    const symbolIndex = keyIndex.build (elements, 'symbol', (a, b) => a.localeCompare (b));
    const englishIndex = keyIndex.build (elements, 'english', (a, b) => a.localeCompare (b));
    const frenchIndex = keyIndex.build (elements, 'french', (a, b) => a.localeCompare (b, 'fr'));
    const japaneseIndex = keyIndex.build (elements, 'japanese', (a, b) => a.localeCompare (b, 'ja'));
    //
    let table = tables.create
    (
        [
            { label: "Z", className: 'atomic-number', key: 'atomic-number' },
            { label: "Symbol", className: 'symbol', key: 'symbol' },
            { label: "English", className: 'name', key: 'english', lang: 'en' },
            { label: "Français", className: 'name', key: 'french', lang: 'fr' },
            { label: "日本語", className: 'name', key: 'japanese', lang: 'ja' }
        ],
        { label: "No Match", className: 'message', lang: 'en' },
        elements,
        atomicNumberIndex // Temp...
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
        liveSearch: liveSearch.value,
        notes: notes.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
