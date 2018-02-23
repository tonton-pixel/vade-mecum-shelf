//
const unit = document.getElementById ('prefectures-of-japan-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const prefecturesContainer = unit.querySelector ('.prefectures-container');
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
    const prefectures = require ('./prefectures.json');
    //
    const readingIndex = tables.buildKeyIndex (prefectures, "読み", (a, b) => a.localeCompare (b, 'ja'));
    const prefectureIndex = tables.buildKeyIndex (prefectures, "都道府県", (a, b) => a.localeCompare (b, 'ja'));
    const regionIndex = tables.buildKeyIndex (prefectures, "地方", (a, b) => a.localeCompare (b, 'ja'));
    const capitalIndex = tables.buildKeyIndex (prefectures, "都道府県庁", (a, b) => a.localeCompare (b, 'ja'));
    const largestIndex = tables.buildKeyIndex (prefectures, "最大都市", (a, b) => a.localeCompare (b, 'ja'));
    //
    let table = tables.create
    (
        [
            { label: "読み", className: 'reading', key: "読み", lang: 'ja' },
            { label: "都道府県", className: 'prefecture', key: "都道府県", lang: 'ja' },
            { label: "地方", className: 'region', key: "地方", lang: 'ja' },
            { label: "都道府県庁", className: 'capital', key: "都道府県庁", lang: 'ja' },
            { label: "最大都市", className: 'largest', key: "最大都市", lang: 'ja' }
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
    liveSearch.addEventListener ('input', (event) => { doSearch (event.target.value); });
};
//
module.exports.stop = function (context)
{
    context.setPrefs ({ liveSearch: liveSearch.value });
};
//
