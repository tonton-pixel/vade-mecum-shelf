//
const unit = document.getElementById ('json-formatter-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const samplesButton = unit.querySelector ('.samples-button');
const inputString = unit.querySelector ('.input-string');
const spaceType = unit.querySelector ('.space-type');
const balancedSpacing = unit.querySelector ('.balanced-spacing');
const finalLineBreak = unit.querySelector ('.final-line-break');
const outputString = unit.querySelector ('.output-string');
//
module.exports.start = function (context)
{
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const json = require ('../../lib/json2.js');
    //
    const defaultPrefs =
    {
        inputString: "",
        spaceType: "",
        balancedSpacing: false,
        finalLineBreak: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const { remote } = require ('electron');
    const { getCurrentWebContents, Menu, MenuItem } = remote;
    const webContents = getCurrentWebContents ();
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            inputString.focus ();
            webContents.selectAll ();
            webContents.delete ();
        }
    );
    //
    const samples = require ('./samples.json');
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
                    inputString.focus ();
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
    function reformat (input)
    {
        let error = false;
        let output = '';
        if (input)
        {
            try
            {
                let space = undefined;
                if (spaceType.value === 'spaces')
                {
                    space = 4;
                }
                else if (spaceType.value === 'tabs')
                {
                    space = '\t';
                }
                output = (balancedSpacing.checked ? json : JSON).stringify (JSON.parse (input), null, space);
                if (finalLineBreak.checked)
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
    function changeSpaceType (value)
    {
        reformat (inputString.value);
    }
    //
    spaceType.value = prefs.spaceType;
    if (spaceType.selectedIndex < 0) // -1: no element is selected
    {
        spaceType.selectedIndex = 0;
    }
    changeSpaceType (spaceType.value);
    spaceType.addEventListener ('input', (event) => { changeSpaceType (event.target.value); });
    //
    function changeBalancedSpacing (checked)
    {
        reformat (inputString.value);
    }
    //
    changeBalancedSpacing (balancedSpacing.checked = prefs.balancedSpacing);
    balancedSpacing.addEventListener ('click', (event) => { changeBalancedSpacing (event.target.checked); });
    //
    function changeFinalLineBreak (checked)
    {
        reformat (inputString.value);
    }
    //
    changeFinalLineBreak (finalLineBreak.checked = prefs.finalLineBreak);
    finalLineBreak.addEventListener ('click', (event) => { changeFinalLineBreak (event.target.checked); });
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        inputString: inputString.value,
        spaceType: spaceType.value,
        balancedSpacing: balancedSpacing.checked,
        finalLineBreak: finalLineBreak.checked
    };
    context.setPrefs (prefs);
};
//
