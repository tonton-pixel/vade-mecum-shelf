//
const unit = document.getElementById ('latex-math-renderer-unit');
//
const latexFormula = unit.querySelector ('.latex-formula');
const displayMode = unit.querySelector ('.display-mode');
const clearButton = unit.querySelector ('.clear-button');
const throwOnError = unit.querySelector ('.throw-on-error');
const latexContainer = unit.querySelector ('.latex-container');
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs =
    {
        latexFormula: "f(x) = \\int _{-\\infty} ^\\infty \\hat f(\\xi) \\, e^{2 \\pi i \\xi x} \\, d \\xi",
        displayMode: true,
        throwOnError: false
    };
    let prefs = getPrefs (defaultPrefs);
    //
    const katex = require ('../../lib/katex/katex.min.js');
    //
    const { remote } = require ('electron');
    const contents = remote.getCurrentWebContents ();
    //
    let katexOptions = { };
    //
    function renderLatex (string)
    {
        let html = "";
        try
        {
            html = katex.renderToString (string, katexOptions);
            if (!displayMode.checked)
            {
                html = `<p>${html}</p>`;
            }
        }
        catch (e)
        {
            let paragraph = document.createElement ('p');
            paragraph.className = 'rendering-error';
            paragraph.textContent = e;
            html = paragraph.outerHTML;
        }
        latexContainer.innerHTML = html;
    }
    renderLatex (latexFormula.value = prefs.latexFormula);
    latexFormula.addEventListener ('input', (event) => renderLatex (event.target.value));
    //
    function changeDisplayMode (checked)
    {
        katexOptions.displayMode = checked;
        renderLatex (latexFormula.value);
    }
    //
    changeDisplayMode (displayMode.checked = prefs.displayMode);
    displayMode.addEventListener ('click', (event) => { changeDisplayMode (event.target.checked); });
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            latexFormula.focus ();
            contents.selectAll ();
            contents.delete ();
        }
    );
    //
    function changeThrowOnError (checked)
    {
        katexOptions.throwOnError = checked;
        renderLatex (latexFormula.value);
    }
    //
    changeThrowOnError (throwOnError.checked = prefs.throwOnError);
    throwOnError.addEventListener ('click', (event) => { changeThrowOnError (event.target.checked); });
};
//
module.exports.stop = function (context, setPrefs)
{
    let prefs =
    {
        latexFormula: latexFormula.value,
        displayMode: displayMode.checked,
        throwOnError: throwOnError.checked
    };
    setPrefs (prefs);
};
//
