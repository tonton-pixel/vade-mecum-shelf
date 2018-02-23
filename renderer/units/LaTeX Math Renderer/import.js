//
const unit = document.getElementById ('latex-math-renderer-unit');
//
const samplesButton = unit.querySelector ('.samples-button');
const clearButton = unit.querySelector ('.clear-button');
const latexFormula = unit.querySelector ('.latex-formula');
const displayMode = unit.querySelector ('.display-mode');
const textColor = unit.querySelector ('.text-color');
const throwOnError = unit.querySelector ('.throw-on-error');
const latexContainer = unit.querySelector ('.latex-container');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        latexFormula: "",
        displayMode: true,
        textColor: false,
        throwOnError: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const katex = require ('../../lib/katex/katex.min.js');
    //
    const { remote, webFrame } = require ('electron');
    const { getCurrentWebContents, Menu, MenuItem, BrowserWindow } = remote;
    const contents = getCurrentWebContents ();
    //
    const samples = require ('./samples.json');
    //
    function pullDownSamplesMenu (button, input)
    {
        let pullDownMenu = new Menu ();
        for (let sample of samples)
        {
            let menuItem = new MenuItem
            (
                {
                    label: sample.label.replace (/&/g, "&&"),
                    click: () =>
                    {
                        let sampleString = sample.string;
                        input.focus ();
                        contents.selectAll ();
                        contents.replace (sampleString);
                    }
                }
            );
            pullDownMenu.append (menuItem);
        }
        let factor = webFrame.getZoomFactor ();
        let targetRect = button.getBoundingClientRect ();
        let x = (targetRect.left * factor) + ((process.platform === 'darwin') ? 0 : 0);  // !!
        let y = (targetRect.bottom  * factor) + ((process.platform === 'darwin') ? 4 : 2);  // !!
        pullDownMenu.popup (Math.round (x), Math.round (y));
    }
    //
    samplesButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownSamplesMenu (event.target, latexFormula);
        }
    );
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
    //
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
    function changeTextColor (checked)
    {
        katexOptions.colorIsTextColor = checked;
        renderLatex (latexFormula.value);
    }
    //
    changeTextColor (textColor.checked = prefs.textColor);
    textColor.addEventListener ('click', (event) => { changeTextColor (event.target.checked); });
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
module.exports.stop = function (context)
{
    let prefs =
    {
        latexFormula: latexFormula.value,
        displayMode: displayMode.checked,
        textColor: textColor.checked,
        throwOnError: throwOnError.checked
    };
    context.setPrefs (prefs);
};
//
