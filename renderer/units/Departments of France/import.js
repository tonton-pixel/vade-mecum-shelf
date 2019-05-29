//
const unit = document.getElementById ('departments-of-france-unit');
//
const liveSearch = unit.querySelector ('.live-search');
const codesContainer = unit.querySelector ('.codes-container');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
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
    const keyIndex = require ('../../lib/key-index.js');
    const tables = require ('../../lib/tables.js');
    //
    const departments = require ('./departments.json');
    //
    const numberIndex = keyIndex.build (departments, 'nombre', (a, b) => a - b);
    const codeIndex = keyIndex.build (departments, 'code', (a, b) => a.localeCompare (b));
    const departmentIndex = keyIndex.build (departments, 'département', (a, b) => a.localeCompare (b, 'fr'));
    const prefectureIndex = keyIndex.build (departments, 'chef-lieu', (a, b) => a.localeCompare (b, 'fr'));
    const regionIndex = keyIndex.build (departments, 'région', (a, b) => a.localeCompare (b, 'fr'));
    //
    let table = tables.create
    (
        [
            { label: "Code", className: 'code', key: 'code' },
            { label: "Département", className: 'département', key: 'département', lang: 'fr' },
            { label: "Chef-lieu", className: 'chef-lieu', key: 'chef-lieu', lang: 'fr' },
            { label: "Région", className: 'région', key: 'région', lang: 'fr' }
        ],
        { label: "Aucun résultat", className: 'message', lang: 'fr' },
        departments,
        numberIndex // Temp...
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
        liveSearch: liveSearch.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
