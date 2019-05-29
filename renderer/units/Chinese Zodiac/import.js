//
const unit = document.getElementById ('chinese-zodiac-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const zodiacContainer = unit.querySelector ('.zodiac-container');
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
    const animals = require ('./animals.json');
    //
    const englishIndex = keyIndex.build (animals, 'english', (a, b) => a.localeCompare (b, 'en'));
    const chineseIndex = keyIndex.build (animals, 'chinese', (a, b) => a.localeCompare (b, 'zh'));
    const japaneseIndex = keyIndex.build (animals, 'japanese', (a, b) => a.localeCompare (b, 'ja'));
    const yearsIndex = keyIndex.build (animals, 'years', (a, b) => a.localeCompare (b, 'ja'));
    //
    let table = tables.create
    (
        [
            { label: "Sign", className: 'english', key: 'english', lang: 'en' },
            { label: "中文", className: 'chinese', key: 'chinese', lang: 'zh' },
            { label: "日本語", className: 'japanese', key: 'japanese', lang: 'ja' },
            { label: "Years", className: 'years', key: 'years' }
        ],
        { label: "No Match", className: 'message' },
        animals,
        yearsIndex // Temp...
    );
    //
    let tableCopy = table.cloneNode (true);
    zodiacContainer.appendChild (tableCopy);
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
        zodiacContainer.appendChild (tableCopy);
    }
    //
    liveSearch.lang = 'en';
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
