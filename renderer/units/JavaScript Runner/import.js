//
const unit = document.getElementById ('javascript-runner-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const samplesButton = unit.querySelector ('.samples-button');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const codeString = unit.querySelector ('.code-string');
const runButton = unit.querySelector ('.run-button');
const outputString = unit.querySelector ('.output-string');
//
const builtInFunctions = unit.querySelector ('.built-in-functions');
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
    const defaultPrefs =
    {
        codeString: "",
        defaultFolderPath: context.defaultFolderPath,
        builtInFunctions: true,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            outputString.value = "";
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
            outputString.value = "";
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
                    outputString.value = "";
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
                    outputString.value = "";
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
    runButton.addEventListener
    (
        'click',
        (event) =>
        {
            outputString.classList.remove ('run-error');
            outputString.value = "";
            if (codeString.value)
            {
                setTimeout
                (
                    function ()
                    {
                        try
                        {
                            const $ =
                            {
                                clear: () => { outputString.value = ""; },
                                //
                                write: (...args) => { outputString.value += args.join (" "); },
                                //
                                writeln: (...args) => { outputString.value += args.join (" ") + "\n"; },
                                //
                                notify:
                                    (message, callback) =>
                                    {
                                        (new Notification (context.name, { body: message })).onclick = () =>
                                        {
                                            webContents.send ('select-unit', context.name);
                                            if (typeof callback === 'function')
                                            {
                                                callback ();
                                            }
                                        };
                                    },
                                //
                                stringify: json.stringify
                            };
                            // http://dfkaye.github.io/2014/03/14/javascript-eval-and-function-constructor/
                            // Because Function does not have access to the local scope, the "use strict"
                            // pragma must be included in the Function body in order to prevent leaking
                            // and clobbering from within a local scope.
                            let result = (new Function ("$", "'use strict';\n" + codeString.value)) ($);
                            if (typeof result !== 'undefined')
                            {
                                outputString.value = result;
                            }
                        }
                        catch (e)
                        {
                            outputString.classList.add ('run-error');
                            outputString.value = e;
                        }
                    }
                );
            }
        }
    );
    //
    builtInFunctions.open = prefs.builtInFunctions;
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
        builtInFunctions: builtInFunctions.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
