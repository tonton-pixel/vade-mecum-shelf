//
const unit = document.getElementById ('technical-definitions-unit');
//
const selectCategory = unit.querySelector ('.select-category');
const definitionsContainer = unit.querySelector ('.definitions-container');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        category: "",
        references: false
    };
    //
    let prefs = context.getPrefs (defaultPrefs);
    //
    let descriptions = require ('./descriptions.json');
    //
    let categories = { };
    //
    for (let description of descriptions)
    {
        let category = description["category"];
        let option = document.createElement ('option');
        option.textContent = category;
        selectCategory.appendChild (option);
        categories[category] = description["items"];
    }
    //
    function displayCategory (category)
    {
        while (definitionsContainer.firstChild)
        {
            definitionsContainer.firstChild.remove ();
        }
        let sheet = document.createElement ('div');
        sheet.className = 'sheet';
        let list = document.createElement ('dl');
        list.className = 'list';
        let items = categories[category];
        for (let item of items)
        {
            let definition = document.createElement ('div');
            definition.className = 'definition';
            let term = document.createElement ('dt');
            term.className = 'term';
            term.textContent = item.term;
            definition.appendChild (term);
            let details = document.createElement ('dd');
            details.className = 'details';
            if (item.extra)
            {
                details.title = item.extra;
            }
            details.innerHTML = item.details;
            definition.appendChild (details);
            list.appendChild (definition);
        }
        sheet.appendChild (list);
        definitionsContainer.appendChild (sheet);
    }
    //
    selectCategory.value = prefs.category;
    if (selectCategory.selectedIndex < 0) // -1: no element is selected
    {
        selectCategory.selectedIndex = 0;
    }
    displayCategory (selectCategory.value);
    //
    selectCategory.addEventListener ('input', (event) => { displayCategory (event.currentTarget.value); });
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
        category: selectCategory.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
