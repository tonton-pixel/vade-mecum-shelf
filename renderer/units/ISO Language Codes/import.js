//
const unit = document.getElementById ('iso-language-codes-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const codesContainer = unit.querySelector ('.codes-container');
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs = { liveSearch: "" };
    let prefs = getPrefs (defaultPrefs);
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
    let sortIndex = code1Index; // Temp...
    //
    let table = document.createElement ('table');
    let header = document.createElement ('tr');
    let th;
    th = document.createElement ('th');
    th.className = 'code';
    th.textContent = "639-1";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'code';
    th.textContent = "639-2";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'language';
    th.textContent = "English";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'language';
    th.lang = 'fr';
    th.textContent = "Français";
    header.appendChild (th);
    table.appendChild (header);
    for (let index = 0; index < codes.length; index++)
    {
        let isoCode = codes[sortIndex[index]];
        let tr = document.createElement ('tr');
        let td;
        td = document.createElement ('td');
        td.className = 'code';
        td.textContent = isoCode["639-1"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'code';
        td.textContent = isoCode["639-2"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'language';
        td.textContent = isoCode["english"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'language';
        td.lang = 'fr';
        td.textContent = isoCode["french"];
        tr.appendChild (td);
        table.appendChild (tr);
    }
    let message = document.createElement ('tr');
    message.setAttribute ('hidden', '');
    td = document.createElement ('td');
    td.setAttribute ('colspan', '4');
    td.className = 'message';
    td.textContent = "No match";
    message.appendChild (td);
    table.appendChild (message);
    table.appendChild (header.cloneNode (true));
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
module.exports.stop = function (context, setPrefs)
{
    setPrefs ({ liveSearch: liveSearch.value });
};
//
