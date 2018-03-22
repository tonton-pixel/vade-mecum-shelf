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
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    const { app, getCurrentWebContents, Menu, MenuItem } = remote;
    const webContents = getCurrentWebContents ();
    //
    const fs = require ('fs');
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    //
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    //
    const defaultPrefs =
    {
        codeString: "",
        defaultFolderPath: app.getPath ('documents')  // 'desktop'
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            outputString.value = "";
            codeString.focus ();
            webContents.selectAll ();
            webContents.delete ();
        }
    );
    //
    let samplesDirname = path.join (__dirname, 'samples');
    let samplesFilenames = fs.readdirSync (samplesDirname);
    samplesFilenames.sort ((a, b) => a.localeCompare (b));
    //
    let samples = [ ];
    //
    for (let samplesFilename of samplesFilenames)
    {
        let filename = path.join (samplesDirname, samplesFilename);
        if (fs.statSync (filename).isFile ())
        {
            let jsFilename = samplesFilename.match (/(.*)\.js$/i);
            if (jsFilename)
            {
                samples.push ( { label: jsFilename[1], string: fs.readFileSync (filename, 'utf8') } );
            }
        }
    }
    //
    let samplesMenu = new Menu ();
    for (let sample of samples)
    {
        let menuItem = new MenuItem
        (
            {
                label: sample.label.replace (/&/g, "&&"),
                click: () =>
                {
                    outputString.value = "";
                    codeString.focus ();
                    webContents.selectAll ();
                    webContents.replace (sample.string);
                }
            }
        );
        samplesMenu.append (menuItem);
    }
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
                "Load JavaScript file:",
                [ { name: "JavaScript (*.js)", extensions: [ 'js' ] } ],
                defaultFolderPath,
                (text, filePath) =>
                {
                    outputString.value = "";
                    codeString.focus ();
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
                "Save JavaScript file:",
                [ { name: 'JavaScript (*.js)', extensions: [ 'js' ] } ],
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
                event.target.style.opacity = '0.5';
                event.target.style.borderStyle = 'dashed';
            }
        };
    codeString.ondragleave =
        (event) =>
        {
            if (hasDesiredType (event.dataTransfer.types))
            {
                event.preventDefault ();
                event.target.style = saveStyle;
            }
        };
    codeString.ondrop =
        (event) =>
        {
            if (hasDesiredType (event.dataTransfer.types))
            {
                event.preventDefault ();
                event.target.style = saveStyle;
                let filePath = getSingleJavaScriptFilePath (event.dataTransfer.files);
                if (filePath)
                {
                    outputString.value = "";
                    codeString.focus ();
                    webContents.selectAll ();
                    webContents.replace (fs.readFileSync (filePath, 'utf8'));
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
                                    }
                            };
                            // <http://dfkaye.github.io/2014/03/14/javascript-eval-and-function-constructor/>:
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
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        codeString: codeString.value,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
