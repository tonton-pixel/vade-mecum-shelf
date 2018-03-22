//
const unit = document.getElementById ('departments-of-france-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const codesContainer = unit.querySelector ('.codes-container');
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
    const departments = require ('./departments.json');
    //
    const keyIndex = tables.buildKeyIndex (departments, "clé", (a, b) => a - b);
    const codeIndex = tables.buildKeyIndex (departments, "code", (a, b) => a.localeCompare (b));
    const departmentIndex = tables.buildKeyIndex (departments, "département", (a, b) => a.localeCompare (b, 'fr'));
    const prefectureIndex = tables.buildKeyIndex (departments, "chef-lieu", (a, b) => a.localeCompare (b, 'fr'));
    //
    let table = tables.create
    (
        [
            { label: "Code", className: 'code', key: "code" },
            { label: "Département", className: 'département', key: "département", lang: 'fr' },
            { label: "Chef-lieu", className: 'chef-lieu', key: "chef-lieu", lang: 'fr' }
        ],
        { label: "Aucun résultat", className: 'message', lang: 'fr' },
        departments,
        keyIndex // Temp...
    );
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
module.exports.stop = function (context)
{
    let prefs =
    {
        liveSearch: liveSearch.value
    };
    context.setPrefs (prefs);
};
//
