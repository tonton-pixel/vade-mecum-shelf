//
const unit = document.getElementById ('derivative-formulas-unit');
//
const formulasContainer = unit.querySelector ('.formulas-container');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
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
    while (formulasContainer.firstChild)
    {
        formulasContainer.firstChild.remove ();
    }
    for (let formula of formulas)
    {
        let category = formula["category"];
        let title = document.createElement ('h2')
        title.className = 'title';
        title.textContent = category;
        formulasContainer.appendChild (title);
        let sheet = document.createElement ('div');
        sheet.className = 'sheet';
        let items = formula["items"];
        for (let item of items)
        {
            if (item)
            {
                let paragraph = document.createElement ('p');
                katex.render (item, paragraph, { displayMode: true, strict: false });
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
        references: references.open
    };
    context.setPrefs (prefs);
};
//
