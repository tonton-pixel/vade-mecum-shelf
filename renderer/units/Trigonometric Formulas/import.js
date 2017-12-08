//
const unit = document.getElementById ('trigonometric-formulas-unit');
//
const container = unit.querySelector ('.formulas-container');
//
module.exports.start = function (context, getPrefs)
{
    const katex = require ('../../lib/katex/katex.min.js');
    //
    const formulas = require ('./formulas.json');
    //
    for (let formula of formulas)
    {
        let panel = document.createElement ('div');
        panel.className = 'plain-panel';
        let h2 = document.createElement ('h2');
        h2.textContent = formula["category"];
        panel.appendChild (h2);
        let sheet = document.createElement ('div');
        sheet.className = 'sheet';
        let items = formula["items"];
        for (let item of items)
        {
            if (item)
            {
                let paragraph = document.createElement ('p');
                paragraph.innerHTML = katex.renderToString (item, { displayMode: true });
                paragraph.title = item;
                sheet.appendChild (paragraph);
            }
            else
            {
                let hr = document.createElement ('hr');
                sheet.appendChild (hr);
            }
        }
        panel.appendChild (sheet);
        container.appendChild (panel);
    }
};
//
module.exports.stop = function (context, setPrefs)
{
};
//
