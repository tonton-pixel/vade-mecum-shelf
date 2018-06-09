//
const unit = document.getElementById ('technical-definitions-unit');
//
const definitionContainers = unit.querySelector ('.definition-containers');
const references = unit.querySelector ('.references');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        references: false
    };
    //
    let prefs = context.getPrefs (defaultPrefs);
    //
    let descriptions = require ('./descriptions.json');
    //
    for (let description of descriptions)
    {
        let panel = document.createElement ('div');
        panel.className = 'plain-panel';
        let category = document.createElement ('h2');
        category.className = 'category';
        category.textContent = description.category;
        panel.appendChild (category);
        let sheet = document.createElement ('div');
        sheet.className = 'sheet';
        let list = document.createElement ('dl');
        list.className = 'list';
        let items = description.items;
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
            details.innerHTML = item.details;
            definition.appendChild (details);
            list.appendChild (definition);
        }
        sheet.appendChild (list);
        panel.appendChild (sheet);
        definitionContainers.appendChild (panel);
    }
   //
    references.open = prefs.references;
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
