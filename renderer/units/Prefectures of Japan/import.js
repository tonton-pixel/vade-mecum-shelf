//
const unit = document.getElementById ('prefectures-of-japan-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const prefecturesContainer = unit.querySelector ('.prefectures-container');
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
    const prefectures = require ('./prefectures.json');
    //
    const readingIndex = keyIndex.build (prefectures, '読み', (a, b) => a.localeCompare (b, 'ja'));
    const prefectureIndex = keyIndex.build (prefectures, '都道府県', (a, b) => a.localeCompare (b, 'ja'));
    const regionIndex = keyIndex.build (prefectures, '地方', (a, b) => a.localeCompare (b, 'ja'));
    const capitalIndex = keyIndex.build (prefectures, '都道府県庁', (a, b) => a.localeCompare (b, 'ja'));
    const largestIndex = keyIndex.build (prefectures, '最大都市', (a, b) => a.localeCompare (b, 'ja'));
    //
    let table = tables.create
    (
        [
            { label: "読み", className: 'reading', key: '読み', lang: 'ja' },
            { label: "都道府県", className: 'prefecture', key: '都道府県', lang: 'ja' },
            { label: "地方", className: 'region', key: '地方', lang: 'ja' },
            { label: "都道府県庁", className: 'capital', key: '都道府県庁', lang: 'ja' },
            { label: "最大都市", className: 'largest', key: '最大都市', lang: 'ja' }
        ],
        { label: "検索結果はありません", className: 'message', lang: 'ja' },
        prefectures,
        readingIndex // Temp...
    );
    //
    let tableCopy = table.cloneNode (true);
    prefecturesContainer.appendChild (tableCopy);
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
        prefecturesContainer.appendChild (tableCopy);
    }
    //
    liveSearch.lang = 'ja';
    liveSearch.placeholder = "検索";
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
