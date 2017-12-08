//
const unit = document.getElementById ('list-of-us-states-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const statesContainer = unit.querySelector ('.states-container');
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs = { liveSearch: "" };
    let prefs = getPrefs (defaultPrefs);
    //
    const tables = require ('../../lib/tables.js');
    //
    const states = require ('./states.json');
    //
    const abbreviationIndex = tables.buildKeyIndex (states, "abbreviation", (a, b) => a.localeCompare (b));
    const nameIndex = tables.buildKeyIndex (states, "name", (a, b) => a.localeCompare (b, 'en'));
    const capitalIndex = tables.buildKeyIndex (states, "capital", (a, b) => a.localeCompare (b, 'en'));
    //
    let sortIndex = abbreviationIndex; // Temp...
    //
    let table = document.createElement ('table');
    let header = document.createElement ('tr');
    let th;
    th = document.createElement ('th');
    th.className = 'abbreviation';
    th.textContent = "Abbreviation";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'name';
    th.textContent = "State Name";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'capital';
    th.textContent = "Capital";
    header.appendChild (th);
    table.appendChild (header);
    for (let index = 0; index < states.length; index++)
    {
        let state = states[sortIndex[index]];
        let tr = document.createElement ('tr');
        let td;
        td = document.createElement ('td');
        td.className = 'abbreviation';
        td.textContent = state["abbreviation"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'name';
        td.textContent = state["name"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'capital';
        td.textContent = state["capital"];
        tr.appendChild (td);
        table.appendChild (tr);
    }
    let message = document.createElement ('tr');
    message.setAttribute ('hidden', '');
    td = document.createElement ('td');
    td.setAttribute ('colspan', '3');
    td.className = 'message';
    td.textContent = "No match";
    message.appendChild (td);
    table.appendChild (message);
    table.appendChild (header.cloneNode (true));
    //
    let tableCopy = table.cloneNode (true);
    statesContainer.appendChild (tableCopy);
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
        statesContainer.appendChild (tableCopy);
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
