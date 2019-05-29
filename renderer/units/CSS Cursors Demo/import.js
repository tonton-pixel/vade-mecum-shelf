//
const unit = document.getElementById ('css-cursors-demo-unit');
//
const demoContainer = unit.querySelector ('.demo-container');
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
    const demos = require ('./demos.json');
    //
    for (let demo of demos)
    {
        let div = document.createElement ('div');
        div.className = 'plain-panel';
        let h2 = document.createElement ('h2');
        h2.textContent = demo["category"];
        div.appendChild (h2);
        let table = document.createElement ('table');
        let items = demo["items"];
        for (let item of items)
        {
            let tr = document.createElement ('tr');
            let th = document.createElement ('th');
            let td = document.createElement ('td');
            th.textContent = item["cursor"];
            th.style.cursor = item["cursor"];
            td.textContent = item["description"];
            tr.appendChild (th);
            tr.appendChild (td);
            table.appendChild (tr);
        }
        div.appendChild (table);
        demoContainer.appendChild (div);
    }
    //
    references.open = prefs.references;
    //
    const refLinks = require ('./ref-links.json');
    const linksList = require ('../../lib/links-list.js');
    //
    linksList (links, refLinks);
}
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