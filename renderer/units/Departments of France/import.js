//
const unit = document.getElementById ('departments-of-france-unit');
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
    const departments = require ('./departments.json');
    //
    const keyIndex = tables.buildKeyIndex (departments, "clé", (a, b) => a - b);
    const codeIndex = tables.buildKeyIndex (departments, "code", (a, b) => a.localeCompare (b));
    const departmentIndex = tables.buildKeyIndex (departments, "département", (a, b) => a.localeCompare (b, 'fr'));
    const prefectureIndex = tables.buildKeyIndex (departments, "chef-lieu", (a, b) => a.localeCompare (b, 'fr'));
    //
    let sortIndex = keyIndex; // Temp...
    //
    let table = document.createElement ('table');
    let header = document.createElement ('tr');
    let th;
    th = document.createElement ('th');
    th.className = 'code';
    th.textContent = "Code";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'département';
    th.lang = 'fr';
    th.textContent = "Département";
    header.appendChild (th);
    th = document.createElement ('th');
    th.className = 'chef-lieu';
    th.lang = 'fr';
    th.textContent = "Chef-lieu";
    header.appendChild (th);
    table.appendChild (header);
    for (let index = 0; index < departments.length; index++)
    {
        let departmentCode = departments[sortIndex[index]];
        let tr = document.createElement ('tr');
        let td;
        td = document.createElement ('td');
        td.className = 'code';
        td.textContent = departmentCode["code"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'département';
        td.lang = 'fr';
        td.textContent = departmentCode["département"];
        tr.appendChild (td);
        td = document.createElement ('td');
        td.className = 'chef-lieu';
        td.lang = 'fr';
        td.textContent = departmentCode["chef-lieu"];
        tr.appendChild (td);
        table.appendChild (tr);
    }
    let message = document.createElement ('tr');
    message.setAttribute ('hidden', '');
    td = document.createElement ('td');
    td.setAttribute ('colspan', '3');
    td.className = 'message';
    td.lang = 'fr';
    td.textContent = "Aucun résultat";
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
    liveSearch.lang = 'fr';
    liveSearch.placeholder = "Rechercher";
    doSearch (liveSearch.value = prefs.liveSearch);
    liveSearch.addEventListener ('input', (event) => { doSearch (event.target.value); });
};
//
module.exports.stop = function (context, setPrefs)
{
    setPrefs ({ liveSearch: liveSearch.value });
};
//
