//
const unit = document.getElementById ('trigonometric-formulas-unit');
//
const selectCategory = unit.querySelector ('.select-category');
const formulasContainer = unit.querySelector ('.formulas-container');
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
    let prefs = context.getPrefs (defaultPrefs);
    //
    const katex = require ('../../lib/katex/katex.min.js');
    //
    let headLink = document.createElement ('link');
    headLink.rel = 'stylesheet';
    headLink.href = 'lib/katex/katex.min.css';
    document.head.appendChild (headLink);
    //
    const formulas = require ('./formulas.json');
    //
    let categories = { };
    //
    for (let formula of formulas)
    {
        let category = formula["category"];
        let option = document.createElement ('option');
        option.textContent = category;
        selectCategory.appendChild (option);
        categories[category] = formula["items"];
    }
    //
    function displayCategory (category)
    {
        while (formulasContainer.firstChild)
        {
            formulasContainer.firstChild.remove ();
        }
        let sheet = document.createElement ('div');
        sheet.className = 'sheet';
        let items = categories[category];
        for (let item of items)
        {
            if (item)
            {
                let paragraph = document.createElement ('p');
                katex.render (item, paragraph, { displayMode: true });
                paragraph.title = item;
                sheet.appendChild (paragraph);
            }
            else
            {
                let hr = document.createElement ('hr');
                sheet.appendChild (hr);
            }
        }
        formulasContainer.appendChild (sheet);
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
