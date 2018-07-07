//
const unit = document.getElementById ('emoji-data-finder-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const emojiSamples = unit.querySelector ('.emoji-samples');
const searchString = unit.querySelector ('.search-string');
const searchButton = unit.querySelector ('.search-button');
const filterButton = unit.querySelector ('.filter-button');
const inputString = unit.querySelector ('.input-string');
const emojiDataList = unit.querySelector ('.emoji-data-list');
const references = unit.querySelector ('.references');
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    const { getCurrentWebContents } = remote;
    const webContents = getCurrentWebContents ();
    //
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus');
    //
    const defaultPrefs =
    {
        inputString: "",
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const cldrAnnotations = require ('../../lib/unicode/get-cldr-annotations.js') ("en.xml");
    //
    function getEmojiShortName (emoji)
    {
        return cldrAnnotations[emoji.replace (/\uFE0F/g, "")].shortName;
    }
    //
    function getEmojiKeywords (emoji)
    {
        return cldrAnnotations[emoji.replace (/\uFE0F/g, "")].keywords;
    }
    //
    const emojiList = require ('../../lib/unicode/get-emoji-list.js') ("11.0");
    const emojiKeys = Object.keys (emojiList).sort ().reverse ();
    //
    function findEmojiByName (name)
    {
        let emojiByName = [ ];
        if (name)
        {
            for (let emoji in emojiList)
            {
                if (getEmojiShortName (emoji).toUpperCase ().indexOf (name.toUpperCase ()) > -1)
                {
                    emojiByName.push (emoji);
                }
                else
                {
                    for (let keyword of getEmojiKeywords (emoji))
                    {
                        if (keyword.toUpperCase ().indexOf (name.toUpperCase ()) > -1)
                        {
                            emojiByName.push (emoji);
                            break;
                        }
                    }
                }
            }
        }
        return emojiByName;
    }
    //
    function getEmojiDataList (string, noDuplicate)
    {
        let emojiDataList = [ ];
        let emojiFound = false;
        while (string.length > 0)
        {
            for (let emoji of emojiKeys)
            {
                if (string.startsWith (emoji))
                {
                    emojiDataList.push (emoji);
                    string = string.slice (emoji.length);
                    emojiFound = true;
                    break;
                }
            }
            if (emojiFound)
            {
                emojiFound = false;
            }
            else
            {
                string = string.slice (1);
            }
        }
        return (noDuplicate) ? [...new Set (emojiDataList)] : emojiDataList;
    }
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
    let emojiMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            inputString.focus ();
            webContents.selectAll ();
            webContents.replace (sample.string);
        }
    );
    //
    emojiSamples.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.target.getBoundingClientRect (), emojiMenu);
        }
    );
    //
    searchString.placeholder = "Name or keyword...";
    searchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault ();    // ??
                searchButton.click ();
            }
        }
    );
    //
    //
    searchButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (searchString.value)
            {
                let emojiByName = findEmojiByName (searchString.value);
                // if (emojiByName.length > 0)
                {
                    inputString.focus ();
                    webContents.selectAll ();
                    webContents.replace (emojiByName.join (''));
                }
            }
        }
    );
    //
    filterButton.addEventListener
    (
        'click',
        (event) =>
        {
            inputString.focus ();
            webContents.selectAll ();
            webContents.replace (getEmojiDataList (inputString.value, true).join (""));
        }
    );
    //
    inputString.value = prefs.inputString;
    //
    function displayDataList (string)
    {
        while (emojiDataList.firstChild)
        {
           emojiDataList.firstChild.remove ();
        } 
        for (let character of getEmojiDataList (string))
        {
            let emojiData = document.createElement ('table');
            emojiData.className = 'emoji-data';
            let firstRow = document.createElement ('tr');
            let emoji = document.createElement ('td');
            emoji.rowSpan = 2;
            emoji.className = 'emoji';
            emoji.textContent = character;
            firstRow.appendChild (emoji);
            let names = document.createElement ('td');
            names.className = 'names';
            let shortName = document.createElement ('div');
            shortName.className = 'short-name';
            shortName.textContent = getEmojiShortName (character);
            names.appendChild (shortName);
            let keywords = document.createElement ('div');
            keywords.className = 'keywords';
            keywords.textContent = getEmojiKeywords (character).join (", ");
            names.appendChild (keywords);
            emojiData.appendChild (firstRow);
            firstRow.appendChild (names);
            let secondRow = document.createElement ('tr');
            let codes = document.createElement ('td');
            codes.className = 'codes';
            let code = emojiList[character].code.split (" ").map (source => { return `U+${source}`; }).join (" ");
            // let code = emojiList[character].code;
            codes.textContent = code;
            let toolTip = (emojiList[character].fullyQualified) ? "Non Fully Qualified": "Fully Qualified";
            codes.title = toolTip;
            secondRow.appendChild (codes);
            emojiData.appendChild (secondRow);
            emojiDataList.appendChild (emojiData);
        }
    }
    //
    displayDataList (inputString.value);
    inputString.addEventListener ('input', (event) => { displayDataList (event.target.value); });
    //
    references.open = prefs.references;
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        inputString: inputString.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
