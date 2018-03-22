//
const unit = document.getElementById ('list-of-us-states-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const statesContainer = unit.querySelector ('.states-container');
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
    const states = require ('./states.json');
    //
    const abbreviationIndex = tables.buildKeyIndex (states, "abbreviation", (a, b) => a.localeCompare (b));
    const nameIndex = tables.buildKeyIndex (states, "name", (a, b) => a.localeCompare (b, 'en'));
    const capitalIndex = tables.buildKeyIndex (states, "capital", (a, b) => a.localeCompare (b, 'en'));
    //
    let table = tables.create
    (
        [
            { label: "Abbreviation", className: 'abbreviation', key: "abbreviation" },
            { label: "State Name", className: 'name', key: "name", lang: 'en' },
            { label: "Capital", className: 'capital', key: "capital", lang: 'en' }
        ],
        { label: "No Match", className: 'message', lang: 'en' },
        states,
        abbreviationIndex // Temp...
    );
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
module.exports.stop = function (context)
{
    let prefs =
    {
        liveSearch: liveSearch.value
    };
    context.setPrefs (prefs);
};
//
