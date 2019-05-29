//
const unit = document.getElementById ('text-converter-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
//
const encoderClearButton = unit.querySelector ('.encoder-clear-button');
const encoderLoadButton = unit.querySelector ('.encoder-load-button');
const encoderSaveButton = unit.querySelector ('.encoder-save-button');
const encoderInputString = unit.querySelector ('.encoder-input-string');
const encoderConversionType = unit.querySelector ('.encoder-conversion-type');
const encoderOutputSaveButton = unit.querySelector ('.encoder-output-save-button');
const encoderOutputString = unit.querySelector ('.encoder-output-string');
//
const decoderClearButton = unit.querySelector ('.decoder-clear-button');
const decoderLoadButton = unit.querySelector ('.decoder-load-button');
const decoderSaveButton = unit.querySelector ('.decoder-save-button');
const decoderInputString = unit.querySelector ('.decoder-input-string');
const decoderConversionType = unit.querySelector ('.decoder-conversion-type');
const decoderOutputSaveButton = unit.querySelector ('.decoder-output-save-button');
const decoderOutputString = unit.querySelector ('.decoder-output-string');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
const upperCaseHex = false;
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    //
    const defaultPrefs =
    {
        tabName: "",
        encoderInputString: "",
        encoderConversionType: "",
        decoderInputString: "",
        decoderConversionType: "",
        defaultFolderPath: context.defaultFolderPath,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    function updateTab (tabName)
    {
        let foundIndex = 0;
        tabs.forEach
        (
            (tab, index) =>
            {
                let match = (tab.parentElement.textContent === tabName);
                if (match)
                {
                    foundIndex = index;
                }
                else
                {
                    tab.checked = false;
                    tabPanes[index].hidden = true;
                }
            }
        );
        tabs[foundIndex].checked = true;
        tabPanes[foundIndex].hidden = false;
    }
    //
    updateTab (prefs.tabName);
    //
    for (let tab of tabs)
    {
        tab.addEventListener ('click', (event) => { updateTab (event.currentTarget.parentElement.textContent); });
    }
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    const loadTextFileFilters =
    [
        { name: "Text File (*.txt)", extensions: [ 'txt' ] },
        { name: "LaTeX File (*.tex)", extensions: [ 'tex' ] },
        { name: "JSON File (*.json)", extensions: [ 'json' ] },
        { name: "JavaScript File (*.js)", extensions: [ 'js' ] }
    ];
    //
    const saveTextFileFilters =
    [
        { name: "Text File (*.txt)", extensions: [ 'txt' ] }
    ];
    //
    const stringFileFilters =
    [
        { name: "Text File (*.txt)", extensions: [ 'txt' ] },
        { name: "JSON File (*.json)", extensions: [ 'json' ] }
    ];
    //
    encoderClearButton.addEventListener
    (
        'click',
        (event) =>
        {
            encoderInputString.value = "";
            encoderInputString.dispatchEvent (new Event ('input'));
            encoderInputString.focus ();
        }
    );
    //
    function encode (input)
    {
        let output = "";
        if (input)
        {
            let isEnclosed = false;
            if (encoderConversionType.value === 'json')
            {
                isEnclosed = true;
                output = JSON.stringify (input);
            }
            else if (encoderConversionType.value === 'hex')
            {
                output = Buffer.from (input, 'utf8').toString ('hex');
                if (upperCaseHex)
                {
                    output = output.toUpperCase ();
                }
            }
            else if (encoderConversionType.value === 'base64')
            {
                output = Buffer.from (input, 'utf8').toString ('base64');
            }
            if (!isEnclosed)
            {
                output = "\"" + output + "\"";
            }
        }
        encoderOutputString.value = output;
    }
    //
    encoderInputString.addEventListener ('input', (event) => encode (event.currentTarget.value));
    encoderInputString.value = prefs.encoderInputString;
    encoderInputString.dispatchEvent (new Event ('input'));
    //
    function changeEncoderConversionType (value)
    {
        encode (encoderInputString.value);
    }
    //
    encoderConversionType.value = prefs.encoderConversionType;
    if (encoderConversionType.selectedIndex < 0) // -1: no element is selected
    {
        encoderConversionType.selectedIndex = 0;
    }
    changeEncoderConversionType (encoderConversionType.value);
    encoderConversionType.addEventListener ('input', (event) => { changeEncoderConversionType (event.currentTarget.value); });
    //
    encoderLoadButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.loadTextFile
            (
                "Load text file:",
                loadTextFileFilters,
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    encoderInputString.value = text;
                    encoderInputString.dispatchEvent (new Event ('input'));
                    defaultFolderPath = path.dirname (filePath);
                }
            );
        }
    );
    //
    encoderSaveButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.saveTextFile
            (
                "Save text file:",
                saveTextFileFilters,
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return encoderInputString.value;
                }
            );
        }
    );
    //
    encoderOutputSaveButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.saveTextFile
            (
                "Save string file:",
                stringFileFilters,
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return encoderOutputString.value;
                }
            );
        }
    );
    //
    decoderClearButton.addEventListener
    (
        'click',
        (event) =>
        {
            decoderInputString.value = "";
            decoderInputString.dispatchEvent (new Event ('input'));
            decoderInputString.focus ();
        }
    );
    //
    function decode (input)
    {
        let error = false;
        let output = "";
        input = input.trim ();
        if (input)
        {
            try
            {
                if (!input.match (/^".*"$/su))
                {
                    throw new Error ("Invalid string format: must be enclosed in double quotes");
                }
                else if (decoderConversionType.value === 'json')
                {
                    output = JSON.parse (input);
                }
                else if (decoderConversionType.value === 'hex')
                {
                    input = input.slice (1, -1);
                    if (input.match (/^([0-9a-fA-F]{2})*$/))
                    {
                        output = Buffer.from (input, 'hex').toString ('utf8');
                    }
                    else
                    {
                        throw new Error ("Invalid Hex string format");
                    }
                }
                else if (decoderConversionType.value === 'base64')
                {
                    input = input.slice (1, -1);
                    // if (input.match (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/))
                    if (input.match (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/))
                    {
                        output = Buffer.from (input, 'base64').toString ('utf8');
                    }
                    else
                    {
                        throw new Error ("Invalid Base64 string format");
                    }
                }
            }
            catch (e)
            {
                output = e.message;
                error = true;
            }
        }
        decoderOutputString.value = output;
        if (error)
        {
            decoderOutputString.classList.add ('output-error');
        }
        else
        {
            decoderOutputString.classList.remove ('output-error');
        }
    }
    //
    decoderInputString.addEventListener ('input', (event) => decode (event.currentTarget.value));
    decoderInputString.value = prefs.decoderInputString;
    decoderInputString.dispatchEvent (new Event ('input'));
    //
    function changeDecoderConversionType (value)
    {
        decode (decoderInputString.value);
    }
    //
    decoderConversionType.value = prefs.decoderConversionType;
    if (decoderConversionType.selectedIndex < 0) // -1: no element is selected
    {
        decoderConversionType.selectedIndex = 0;
    }
    changeDecoderConversionType (decoderConversionType.value);
    decoderConversionType.addEventListener ('input', (event) => { changeDecoderConversionType (event.currentTarget.value); });
    //
    decoderLoadButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.loadTextFile
            (
                "Load string file:",
                stringFileFilters,
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    decoderInputString.value = text;
                    decoderInputString.dispatchEvent (new Event ('input'));
                    defaultFolderPath = path.dirname (filePath);
                }
            );
        }
    );
    //
    decoderSaveButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.saveTextFile
            (
                "Save string file:",
                stringFileFilters,
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return decoderInputString.value;
                }
            );
        }
    );
    //
    decoderOutputSaveButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.saveTextFile
            (
                "Save text file:",
                saveTextFileFilters,
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return decoderOutputString.value;
                }
            );
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
    function getCurrentTabName ()
    {
        let currentTabName = "";
        for (let tab of tabs)
        {
            if (tab.checked)
            {
                currentTabName = tab.parentElement.textContent;
                break;
            }
        }
        return currentTabName;
    }
    //
    let prefs =
    {
        tabName: getCurrentTabName (),
        encoderInputString: encoderInputString.value,
        encoderConversionType: encoderConversionType.value,
        decoderInputString: decoderInputString.value,
        decoderConversionType: decoderConversionType.value,
        defaultFolderPath: defaultFolderPath,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
