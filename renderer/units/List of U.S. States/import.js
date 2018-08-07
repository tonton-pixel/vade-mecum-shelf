//
const unit = document.getElementById ('list-of-us-states-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const statesContainer = unit.querySelector ('.states-container');
//
const references = unit.querySelector ('.references');
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
    const tables = require ('../../lib/tables.js');
    //
    const states = require ('./states.json');
    for (let state of states)
    {
        if (!state.largest)
        {
            state.largest = state.capital;
        }
    }
    //
    const abbreviationIndex = tables.buildKeyIndex (states, "abbreviation", (a, b) => a.localeCompare (b));
    const stateIndex = tables.buildKeyIndex (states, "state", (a, b) => a.localeCompare (b, 'en'));
    const capitalIndex = tables.buildKeyIndex (states, "capital", (a, b) => a.localeCompare (b, 'en'));
    const largestIndex = tables.buildKeyIndex (states, "largest", (a, b) => a.localeCompare (b, 'en'));
    //
    let table = tables.create
    (
        [
            { label: "Abbreviation", className: 'abbreviation', key: "abbreviation" },
            { label: "State Name", className: 'state', key: "state", lang: 'en' },
            { label: "Capital City", className: 'city', key: "capital", lang: 'en' },
            { label: "Largest City", className: 'city', key: "largest", lang: 'en' }
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
    //
    references.open = prefs.references;
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
