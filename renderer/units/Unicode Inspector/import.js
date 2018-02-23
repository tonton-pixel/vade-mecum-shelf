//
const unit = document.getElementById ('unicode-inspector-unit');
//
const charactersClear = unit.querySelector ('.characters-clear');
const charactersSamples = unit.querySelector ('.characters-samples');
const inputCharacters = unit.querySelector ('.input-characters');
const outputCodePoints = unit.querySelector ('.output-code-points');
const outputCharactersData = unit.querySelector ('.output-characters-data');
//
const codePointsClear = unit.querySelector ('.code-points-clear');
const codePointsSamples = unit.querySelector ('.code-points-samples');
const inputCodePoints = unit.querySelector ('.input-code-points');
const outputCharacters = unit.querySelector ('.output-characters');
const outputCodePointsData = unit.querySelector ('.output-code-points-data');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        inputCharacters: "",
        inputCodePoints: ""
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const unicode = require ('./unicode.js');
    //
    const { remote, webFrame } = require ('electron');
    const { getCurrentWebContents, Menu, MenuItem, BrowserWindow } = remote;
    const contents = getCurrentWebContents ();
    //
    const samples = require ('./samples.json');
    //
    function pullDownSamplesMenu (button, input, codePoints)
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
                        if (codePoints)
                        {
                            sampleString = unicode.charactersToCodePoints (sampleString);
                        }
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
    charactersSamples.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownSamplesMenu (event.target, inputCharacters, false);
        }
    );
    //
    charactersClear.addEventListener
    (
        'click',
        (event) =>
        {
            inputCharacters.focus ();
            contents.selectAll ();
            contents.delete ();
        }
    );
    //
    function displayDataList (string, outputData)
    {
        if (outputData.firstChild)
        {
           outputData.firstChild.remove ();
        }
        let dataList = unicode.stringToDataList (string);
        if (dataList.length > 0)
        {
            let table = document.createElement ('table');
            table.className = 'data-list';
            let cell;
            let header = document.createElement ('tr');
            cell = document.createElement ('th');
            cell.className = 'data-header-centered';
            cell.textContent = "Symbol";    // "Character"
            header.appendChild (cell);
            cell = document.createElement ('th');
            cell.className = 'data-header';
            cell.textContent = "Codes";
            header.appendChild (cell);
            cell = document.createElement ('th');
            cell.className = 'data-header';
            cell.textContent = "Properties";
            header.appendChild (cell);
            table.appendChild (header);
            for (let data of dataList)
            {
                let row = document.createElement ('tr');
                cell = document.createElement ('td');
                cell.className = 'symbol';
                cell.textContent = data.character;
                row.appendChild (cell);
                cell = document.createElement ('td');
                cell.className = 'codes';
                let codes =
                [
                    { label: "Code\xA0Point", value: data.codePoint },  // "Unicode"
                    { label: "ECMAScript", value: data.ecmaScript },
                    { label: "JavaScript", value: data.javaScript },
                    { label: "UTF-16", value: data.utf16 },
                    { label: "UTF-8", value: data.utf8 },
                    { label: "Entity", value: data.entity }
                ];
                for (let code of codes)
                {
                    if (code.value)
                    {
                        let field = document.createElement ('div');
                        field.className = 'field';
                        field.textContent = code.label + ": " + code.value;
                        cell.appendChild (field);
                    }
                }
                row.appendChild (cell);
                cell = document.createElement ('td');
                cell.className = 'properties';
                let numericType = "";
                if (data.numeric)
                {
                    numericType = "Numeric";
                    if (data.digit)
                    {
                        numericType = "Digit";
                        if (data.decimal)
                        {
                            numericType = "Decimal";
                        }
                    }
                }
                let properties =
                [
                    { label: "Name", value: data.name, toolTip: data.old },
                    { label: "Plane", value: data.planeName, toolTip: data.planeRange },
                    { label: "Block", value: data.blockName, toolTip: data.blockRange },
                    { label: "Category", value: data.category },
                    { label: "Combining", value: data.combining },
                    { label: "Bidirectional", value: data.bidirectional },
                    { label: "Decomposition", value: data.decomposition },
                    { label: "Mirrored", value: data.mirrored },
                    { label: numericType, value: data.numeric },
                    { label: "Uppercase", value: data.uppercase },
                    { label: "Lowercase", value: data.lowercase },
                    { label: "Titlecase", value: data.titlecase }
                ];
                for (let property of properties)
                {
                    if (property.value)
                    {
                        let field = document.createElement ('div');
                        field.className = 'field';
                        field.textContent = property.label + ": " + property.value;
                        if (property.toolTip)
                        {
                            field.title = property.toolTip;
                        }
                        cell.appendChild (field);
                    }
                }
                row.appendChild (cell);
                table.appendChild (row);
            }
            outputData.appendChild (table);
        }
    }
    //
    inputCharacters.addEventListener
    (
        'input',
        (event) =>
        {
            outputCodePoints.value = unicode.charactersToCodePoints (event.target.value);
            displayDataList (event.target.value, outputCharactersData);
        }
    );
    inputCharacters.value = prefs.inputCharacters; inputCharacters.dispatchEvent (new Event ('input'));
    //
    codePointsSamples.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownSamplesMenu (event.target, inputCodePoints, true);
        }
    );
    //
    codePointsClear.addEventListener
    (
        'click',
        (event) =>
        {
            inputCodePoints.focus ();
            contents.selectAll ();
            contents.delete ();
        }
    );
    //
    inputCodePoints.addEventListener
    (
        'input',
        (event) =>
        {
            outputCharacters.value = unicode.codePointsToCharacters (event.target.value);
            displayDataList (outputCharacters.value, outputCodePointsData);
        }
    );
    inputCodePoints.value = prefs.inputCodePoints; inputCodePoints.dispatchEvent (new Event ('input'));
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        inputCharacters: inputCharacters.value,
        inputCodePoints: inputCodePoints.value
    };
    context.setPrefs (prefs);
};
//
