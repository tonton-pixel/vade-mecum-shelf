//
const unit = document.getElementById ('prefectures-of-japan-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const prefecturesContainer = unit.querySelector ('.prefectures-container');
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs = { liveSearch: "" };
    let prefs = getPrefs (defaultPrefs);
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
    let sortIndex = readingIndex; // Temp...
    //
    let table = document.createElement ('table');
    let header = document.createElement ('tr');
    let th;
    th = document.createElement ('th');
    th.className = 'reading';
    th.lang = 'ja';
    th.textContent = "読み";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'prefecture';
    th.lang = 'ja';
    th.textContent = "都道府県";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'region';
    th.lang = 'ja';
    th.textContent = "地方";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'capital';
    th.lang = 'ja';
    th.textContent = "都道府県庁";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'largest';
    th.lang = 'ja';
    th.textContent = "最大都市";
    header.appendChild (th);
    table.appendChild (header);
    for (let index = 0; index < prefectures.length; index++)
    {
        let state = prefectures[sortIndex[index]];
        let tr = document.createElement ('tr');
        let td;
        td = document.createElement ('td');
        td.className = 'reading';
        td.lang = 'ja';
        td.textContent = state["読み"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'prefecture';
        td.lang = 'ja';
        td.textContent = state["都道府県"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'region';
        td.lang = 'ja';
        td.textContent = state["地方"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'capital';
        td.lang = 'ja';
        td.textContent = state["都道府県庁"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'largest';
        td.lang = 'ja';
        td.textContent = state["最大都市"];
        tr.appendChild (td);
        table.appendChild (tr);
    }
    let message = document.createElement ('tr');
    message.setAttribute ('hidden', '');
    td = document.createElement ('td');
    td.setAttribute ('colspan', '5');
    td.className = 'message';
    td.lang = 'ja';
    td.textContent = "検索結果はありません";
    message.appendChild (td);
    table.appendChild (message);
    table.appendChild (header.cloneNode (true));
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
module.exports.stop = function (context, setPrefs)
{
    setPrefs ({ liveSearch: liveSearch.value });
};
//
