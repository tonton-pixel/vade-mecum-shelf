//
const unit = document.getElementById ('javascript-parser-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const samplesButton = unit.querySelector ('.samples-button');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const codeString = unit.querySelector ('.code-string');
const parseButton = unit.querySelector ('.parse-button');
const tokenizeButton = unit.querySelector ('.tokenize-button');
const resultString = unit.querySelector ('.result-string');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    const { getCurrentWebContents } = remote;
    const webContents = getCurrentWebContents ();
    //
    const fs = require ('fs');
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus');
    //
    const json = require ('../../lib/json2.js');
    //
    const esprima = require ('esprima');
    //
    const defaultPrefs =
    {
        codeString: "",
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
            resultString.value = "";
            codeString.value = "";
            codeString.focus ();
        }
    );
    //
    let samplesDirname = path.join (__dirname, 'samples');
    let samplesFilenames = fs.readdirSync (samplesDirname);
    samplesFilenames.sort ((a, b) => a.localeCompare (b));
    let samples = [ ];
    for (let samplesFilename of samplesFilenames)
    {
        let filename = path.join (samplesDirname, samplesFilename);
        if (fs.statSync (filename).isDirectory ())
        {
            let dirname = filename;
            let itemsFilenames = fs.readdirSync (dirname);
            itemsFilenames.sort ((a, b) => a.localeCompare (b));
            let items = [ ];
            for (let itemsFilename of itemsFilenames)
            {
                let filename = path.join (dirname, itemsFilename);
                if (fs.statSync (filename).isFile ())
                {
                    let jsFilename = itemsFilename.match (/(.*)\.js$/i);
                    if (jsFilename)
                    {
                        items.push ({ label: jsFilename[1], string: fs.readFileSync (filename, 'utf8') });
                    }
                }
            }
            samples.push ({ label: samplesFilename, items: items });
        }
        else if (fs.statSync (filename).isFile ())
        {
            let jsFilename = samplesFilename.match (/(.*)\.js$/i);
            if (jsFilename)
            {
                samples.push ({ label: jsFilename[1], string: fs.readFileSync (filename, 'utf8') });
            }
        }
    }
    //
    let samplesMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            resultString.value = "";
            codeString.value = sample.string;
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
                "Load JavaScript file:",
                [ { name: "JavaScript (*.js)", extensions: [ 'js' ] } ],
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    resultString.value = "";
                    codeString.value = text;
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
                "Save JavaScript file:",
                [ { name: "JavaScript (*.js)", extensions: [ 'js' ] } ],
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return codeString.value;
                }
            );
        }
    );
    //
    codeString.value = prefs.codeString;
    //
    let saveStyle = getComputedStyle (codeString);
    //
    function hasDesiredType (types)
    {
        return (!types.includes ('text/plain')) && types.includes ('Files');
    }
    //
    function getSingleJavaScriptFilePath (files)
    {
        let filePath = null;
        if ((files.length === 1) && fs.statSync (files[0].path).isFile () && files[0].name.match (/.*\.js$/i))
        {
            filePath = files[0].path;
        }
        return filePath;
    }
    //
    codeString.ondragenter =
    codeString.ondragover =
        (event) =>
        {
            if (hasDesiredType (event.dataTransfer.types))
            {
                event.preventDefault ();
                event.currentTarget.style.opacity = '0.5';
                event.currentTarget.style.borderStyle = 'dashed';
            }
        };
    codeString.ondragleave =
        (event) =>
        {
            if (hasDesiredType (event.dataTransfer.types))
            {
                event.preventDefault ();
                event.currentTarget.style = saveStyle;
            }
        };
    codeString.ondrop =
        (event) =>
        {
            if (hasDesiredType (event.dataTransfer.types))
            {
                event.preventDefault ();
                event.currentTarget.style = saveStyle;
                let filePath = getSingleJavaScriptFilePath (event.dataTransfer.files);
                if (filePath)
                {
                    resultString.value = "";
                    codeString.value = fs.readFileSync (filePath, 'utf8');
                }
                else
                {
                    remote.shell.beep ();
                }
            }
            event.dataTransfer.clearData ();
        };
    //
    function adjustRegexLiteral (key, value)
    {
        if ((key === 'value') && (value instanceof RegExp))
        {
            value = undefined;  // Not a JSON-compatible type in the first place, and redundant with 'regex' anyway...
        }
        return value;
    }
    //
    function runParser (parser)
    {
        resultString.classList.remove ('parse-error');
        resultString.value = "";
        if (codeString.value)
        {
            setTimeout
            (
                function ()
                {
                    try
                    {
                        resultString.value = json.stringify (parser (codeString.value), adjustRegexLiteral, 4);
                    }
                    catch (e)
                    {
                        resultString.classList.add ('parse-error');
                        resultString.value = e;
                    }
                }
            );
        }
    }
    //
    parseButton.addEventListener
    (
        'click',
        (event) =>
        {
            runParser (esprima.parseScript);
        }
    );
    //
    tokenizeButton.addEventListener
    (
        'click',
        (event) =>
        {
            runParser (esprima.tokenize);
        }
    );
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
        codeString: codeString.value,
        defaultFolderPath: defaultFolderPath,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
