//
const unit = document.getElementById ('latex-math-renderer-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const samplesButton = unit.querySelector ('.samples-button');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const latexFormula = unit.querySelector ('.latex-formula');
const displayMode = unit.querySelector ('.display-mode');
const textColor = unit.querySelector ('.text-color');
const throwOnError = unit.querySelector ('.throw-on-error');
const latexContainer = unit.querySelector ('.latex-container');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus');
    //
    const katex = require ('../../lib/katex/katex.min.js');
    //
    const defaultPrefs =
    {
        latexFormula: "",
        displayMode: true,
        textColor: false,
        throwOnError: false,
        defaultFolderPath: context.defaultFolderPath,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            latexFormula.value = "";
            latexFormula.dispatchEvent (new Event ('input'));
            latexFormula.focus ();
        }
    );
    //
    const samples = require ('./samples.json');
    //
    let samplesMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            latexFormula.value = sample.string;
            latexFormula.dispatchEvent (new Event ('input'));
        }
    );
    //
    samplesButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, samplesMenu);
        }
    );
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    loadButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.loadTextFile
            (
                "Load LaTeX file:",
                [ { name: "LaTeX (*.tex)", extensions: [ 'tex' ] } ],
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    latexFormula.value = text;
                    latexFormula.dispatchEvent (new Event ('input'));
                    defaultFolderPath = path.dirname (filePath);
                }
            );
        }
    );
    //
    saveButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.saveTextFile
            (
                "Save LaTeX file:",
                [ { name: "LaTeX (*.tex)", extensions: [ 'tex' ] } ],
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return latexFormula.value;
                }
            );
        }
    );
    //
    let katexOptions = { allowedProtocols: [ "http", "https" ] };
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
    latexFormula.addEventListener ('input', (event) => renderLatex (event.currentTarget.value));
    latexFormula.value = prefs.latexFormula;
    latexFormula.dispatchEvent (new Event ('input'));
    //
    function changeDisplayMode (checked)
    {
        katexOptions.displayMode = checked;
        renderLatex (latexFormula.value);
    }
    //
    changeDisplayMode (displayMode.checked = prefs.displayMode);
    displayMode.addEventListener ('click', (event) => { changeDisplayMode (event.currentTarget.checked); });
    //
    function changeTextColor (checked)
    {
        katexOptions.colorIsTextColor = checked;
        renderLatex (latexFormula.value);
    }
    //
    changeTextColor (textColor.checked = prefs.textColor);
    textColor.addEventListener ('click', (event) => { changeTextColor (event.currentTarget.checked); });
    //
    function changeThrowOnError (checked)
    {
        katexOptions.throwOnError = checked;
        renderLatex (latexFormula.value);
    }
    //
    changeThrowOnError (throwOnError.checked = prefs.throwOnError);
    throwOnError.addEventListener ('click', (event) => { changeThrowOnError (event.currentTarget.checked); });
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
        latexFormula: latexFormula.value,
        displayMode: displayMode.checked,
        textColor: textColor.checked,
        throwOnError: throwOnError.checked,
        defaultFolderPath: defaultFolderPath,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
