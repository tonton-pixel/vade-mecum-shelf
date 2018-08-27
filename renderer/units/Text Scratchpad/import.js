//
const unit = document.getElementById ('text-scratchpad-unit');
//
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const clearButton = unit.querySelector ('.clear-button');
const textString = unit.querySelector ('.text-string');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    const { app, Menu, MenuItem } = remote;
    //
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    //
    const defaultPrefs =
    {
        textString: "",
        defaultFolderPath: app.getPath ('documents')  // 'desktop'
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            textString.value = "";
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
                "Load text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    textString.value = text;
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
                "Save text file:",
                [ { name: 'Text (*.txt)', extensions: [ 'txt' ] } ],
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return textString.value;
                }
            );
        }
    );
    //
    textString.value = prefs.textString;
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        textString: textString.value,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
