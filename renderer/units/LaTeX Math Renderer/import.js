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
const references = unit.querySelector ('.references');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    const { app, getCurrentWebContents } = remote;
    const webContents = getCurrentWebContents ();
    //
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
        defaultFolderPath: app.getPath ('documents'),  // 'desktop'
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            latexFormula.focus ();
            webContents.selectAll ();
            webContents.delete ();
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
            latexFormula.focus ();
            webContents.selectAll ();
            webContents.replace (sample.string);
        }
    );
    //
    samplesButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.target.getBoundingClientRect (), samplesMenu);
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
                    latexFormula.focus ();
                    webContents.selectAll ();
                    webContents.replace (text);
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
                [ { name: 'LaTeX (*.tex)', extensions: [ 'tex' ] } ],
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
    //
    references.open = prefs.references;
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
