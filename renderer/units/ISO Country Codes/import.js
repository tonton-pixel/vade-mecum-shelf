//
const unit = document.getElementById ('iso-country-codes-unit');
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
    const numericIndex = tables.buildKeyIndex (codes, "numeric", (a, b) => a - b); // Not used yet...
    const alpha2Index = tables.buildKeyIndex (codes, "alpha-2", (a, b) => a.localeCompare (b));
    const alpha3Index = tables.buildKeyIndex (codes, "alpha-3", (a, b) => a.localeCompare (b));
    const englishIndex = tables.buildKeyIndex (codes, "english", (a, b) => a.localeCompare (b, 'en'));
    const frenchIndex = tables.buildKeyIndex (codes, "french", (a, b) => a.localeCompare (b, 'fr'));
    //
    let sortIndex = alpha2Index; // Temp...
    //
    let table = document.createElement ('table');
    let header = document.createElement ('tr');
    let th;
    th = document.createElement ('th');
    th.className = 'code';
    th.textContent = "Alpha-2";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'code';
    th.textContent = "Alpha-3";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'country';
    th.textContent = "English";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'country';
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
        td.textContent = isoCode["alpha-2"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'code';
        td.textContent = isoCode["alpha-3"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'country';
        td.textContent = isoCode["english"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'country';
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
