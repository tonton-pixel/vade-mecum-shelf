//
const unit = document.getElementById ('color-names-unit');
//
const setsContainer = unit.querySelector ('.sets-container');
const setSelector = unit.querySelector ('.set-selector');
const liveSearch = unit.querySelector ('.live-search');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        setSelector: "",
        liveSearch: "",
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const sets = require ('./sets.json');
    //
    let setTables = { };
    //
    for (let set of sets)
    {
        let table = document.createElement ('table');
        let tr = document.createElement ('tr');
        let th;
        th = document.createElement ('th');
        th.className = 'name';
        th.textContent = "Name";
        tr.appendChild (th);
        th = document.createElement ('th');
        th.className = 'hex';
        th.textContent = "Hex";
        tr.appendChild (th);
        th = document.createElement ('th');
        th.className = 'color';
        th.textContent = "Color";
        tr.appendChild (th);
        table.appendChild (tr);
        let colors = set.colors;
        for (let color of colors)
        {
            let tr = document.createElement ('tr');
            let td;
            td = document.createElement ('td');
            td.className = 'name';
            td.textContent = (typeof color.name === 'string') ? color.name : color.name["en"]; // Temp...
            td.lang = "en"; // Temp...
            tr.appendChild (td);
            td = document.createElement ('td');
            td.className = 'hex';
            td.textContent = color.hex;
            tr.appendChild (td);
            td = document.createElement ('td');
            td.className = 'color';
            let div = document.createElement ('div');
            div.className = 'swatch';
            div.style.setProperty ('background-color', color.hex);
            div.style.setProperty ('color', color.hex);
            div.textContent = div.style.getPropertyValue ('color'); // Gets automatically converted to rgb() syntax format!
            div.title = div.textContent;
            td.appendChild (div);
            tr.appendChild (td);
            table.appendChild (tr);
            table.dataset.info = `${colors.length} colors`;
            setTables[set.name] = table;
            setsContainer.appendChild (table);
        }
        let message = document.createElement ('tr');
        message.className = 'message';
        message.setAttribute ('hidden', '');
        td = document.createElement ('td');
        td.setAttribute ('colspan', '3');
        td.className = 'message';
        td.textContent = "No match";
        message.appendChild (td);
        table.appendChild (message);
        //
        let option = document.createElement ('option');
        option.textContent = set.name;
        setSelector.appendChild (option);
    }
    //
    setSelector.value = prefs.setSelector;
    if (setSelector.selectedIndex < 0) // -1: no element is selected
    {
        setSelector.selectedIndex = 0;
    }
    let currentSet = setSelector.value;
    setTables[currentSet].classList.add ('is-shown');
    setSelector.title = setTables[currentSet].dataset.info;
    setSelector.addEventListener
    (
        'input',
        (event) =>
        {
            setTables[currentSet].classList.remove ('is-shown');
            setTables[currentSet = event.currentTarget.value].classList.add ('is-shown');
            event.currentTarget.title = setTables[currentSet].dataset.info;
        }
    );
    //
    let searchTableDataWithHide = function (table, searchString) // To be merged with tables.searchData with a new parameter noRemove...
    {
        let matchingRowCount = -1;
        if (searchString.length > 0)
        {
            matchingRowCount = 0;
            let rows = table.getElementsByTagName ("tr");
            for (let row of rows)
            {
                if (!row.hidden) // !row.hasAttribute ('hidden')
                {
                    row.style.removeProperty ('display');
                    let match = false;
                    let columns = row.getElementsByTagName ("td");
                    if (columns.length > 0)
                    {
                        for (let column of columns)
                        {
                            if (column.textContent.toUpperCase ().indexOf (searchString.toUpperCase ()) > -1)
                            {
                                match = true;
                                matchingRowCount++;
                                break;
                            }
                        }
                        if (!match) row.style.setProperty ('display', 'none');
                    }
                }
            }
        }
        else
        {
            let rows = table.getElementsByTagName ("tr");
            for (let row of rows)
            {
                if (!row.hidden) // !row.hasAttribute ('hidden')
                {
                    row.style.removeProperty ('display');
                }
            }
        }
        return (matchingRowCount);
    };
    //
    function doSearch (string)
    {
        for (let colorSet in setTables)
        {
            let setTable = setTables[colorSet];
            setTable.querySelector ('tr.message').setAttribute ('hidden', '');
            let matchingRowCount = searchTableDataWithHide (setTable, string);
            if (matchingRowCount === 0)
            {
                setTable.querySelector ('tr.message').removeAttribute ('hidden');
            }
        }
    }
    //
    liveSearch.placeholder = "Search";
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
        setSelector: setSelector.value,
        liveSearch: liveSearch.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
