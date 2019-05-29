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
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus');
    const json = require ('../../lib/json2.js');
    //
    const defaultPrefs =
    {
        inputString: "",
        spaceType: "",
        balancedSpacing: false,
        finalLineBreak: false,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            inputString.value = "";
            inputString.dispatchEvent (new Event ('input'));
            inputString.focus ();
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
            inputString.value = sample.string;
            inputString.dispatchEvent (new Event ('input'));
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
                    output += "\n";
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
            outputString.classList.add ('output-error');
        }
        else
        {
            outputString.classList.remove ('output-error');
        }
    }
    //
    inputString.addEventListener ('input', (event) => reformat (event.currentTarget.value));
    inputString.value = prefs.inputString;
    inputString.dispatchEvent (new Event ('input'));
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
    spaceType.addEventListener ('input', (event) => { changeSpaceType (event.currentTarget.value); });
    //
    function changeBalancedSpacing (checked)
    {
        reformat (inputString.value);
    }
    //
    changeBalancedSpacing (balancedSpacing.checked = prefs.balancedSpacing);
    balancedSpacing.addEventListener ('click', (event) => { changeBalancedSpacing (event.currentTarget.checked); });
    //
    function changeFinalLineBreak (checked)
    {
        reformat (inputString.value);
    }
    //
    changeFinalLineBreak (finalLineBreak.checked = prefs.finalLineBreak);
    finalLineBreak.addEventListener ('click', (event) => { changeFinalLineBreak (event.currentTarget.checked); });
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
        inputString: inputString.value,
        spaceType: spaceType.value,
        balancedSpacing: balancedSpacing.checked,
        finalLineBreak: finalLineBreak.checked,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
