//
const unit = document.getElementById ('json-formatter-unit');
//
const samplesButton = unit.querySelector ('.samples-button');
const clearButton = unit.querySelector ('.clear-button');
const inputString = unit.querySelector ('.input-string');
const expandTabs = unit.querySelector ('.expand-tabs');
const appendLineBreak = unit.querySelector ('.append-line-break');
const outputString = unit.querySelector ('.output-string');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        inputString: "",
        expandTabs: false,
        appendLineBreak: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const json = require ('./json.js');
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
            pullDownSamplesMenu (event.target, inputString);
        }
    );
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            inputString.focus ();
            contents.selectAll ();
            contents.delete ();
        }
    );
    //
    function reformat (input)
    {
        let error = false;
        let output = '';
        if (input)
        {
            try
            {
                output = json.stringify (json.parse (input), expandTabs.checked ? 4 : '\t');
                if (appendLineBreak.checked)
                {
                    output += '\n';
                }
            }
            catch (e)
            {
                output = e.message;
                error = true;
            }
        }
        outputString.value = output;
        if (error)
        {
            outputString.classList.add ('rendering-error');
        }
        else
        {
            outputString.classList.remove ('rendering-error');
        }
    }
    //
    reformat (inputString.value = prefs.inputString);
    inputString.addEventListener ('input', (event) => reformat (event.target.value));
    //
    function changeExpandTabs (checked)
    {
        reformat (inputString.value);
    }
    //
    changeExpandTabs (expandTabs.checked = prefs.expandTabs);
    expandTabs.addEventListener ('click', (event) => { changeExpandTabs (event.target.checked); });
    //
    function changeAppendLineBreak (checked)
    {
        reformat (inputString.value);
    }
    //
    changeAppendLineBreak (appendLineBreak.checked = prefs.appendLineBreak);
    appendLineBreak.addEventListener ('click', (event) => { changeAppendLineBreak (event.target.checked); });
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        inputString: inputString.value,
        expandTabs: expandTabs.checked,
        appendLineBreak: appendLineBreak.checked
    };
    context.setPrefs (prefs);
};
//
