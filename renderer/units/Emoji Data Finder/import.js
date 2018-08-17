//
const unit = document.getElementById ('emoji-data-finder-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const emojiSamples = unit.querySelector ('.emoji-samples');
const searchString = unit.querySelector ('.search-string');
const wholeWord = unit.querySelector ('.whole-word');
const useRegex = unit.querySelector ('.use-regex');
const searchButton = unit.querySelector ('.search-button');
const inputString = unit.querySelector ('.input-string');
const hitCount = unit.querySelector ('.hit-count');
const filterButton = unit.querySelector ('.filter-button');
const emojiDataList = unit.querySelector ('.emoji-data-list');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
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
    const useES6Regex = true;
    //
    const rewritePattern = require ('regexpu-core');
    //
    const defaultPrefs =
    {
        searchString: "",
        wholeWord: false,
        useRegex: false,
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
    const emojiList = require ('emoji-test-list');
    const emojiKeys = Object.keys (emojiList).sort ().reverse ();
    //
    function findEmojiByName (regex)
    {
        let emojiByName = [ ];
        for (let emoji in emojiList)
        {
            if (getEmojiShortName (emoji).match (regex))
            {
                emojiByName.push (emoji);
            }
            else
            {
                for (let keyword of getEmojiKeywords (emoji))
                {
                    if (keyword.match (regex))
                    {
                        emojiByName.push (emoji);
                        break;
                    }
                }
            }
        }
        return emojiByName;
    }
    //
    const emojiPatterns = require ('emoji-patterns');
    // Exclude the 12 keycap bases and the 26 singleton Regional Indicator characters
    const emojiPattern = emojiPatterns["Emoji_All"].replace (/\\u\{23\}\\u\{2A\}\\u\{30\}-\\u\{39\}|\\u\{1F1E6\}-\\u\{1F1FF\}/gi, "");
    const emojiRegex = new RegExp (emojiPattern, 'gu');
    //
    function getEmojiDataList (string)
    {
        return [...new Set (string.match (emojiRegex))];
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
    wholeWord.checked = prefs.wholeWord;
    useRegex.checked = prefs.useRegex;
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
    searchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            event.target.title = "";
            if (useRegex.checked)
            {
                try
                {
                    const flags = 'ui';
                    let pattern = event.target.value;
                    if (useES6Regex)
                    {
                        pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                    }
                    let regex = new RegExp (pattern, flags);
                }
                catch (e)
                {
                    event.target.classList.add ('error');
                    event.target.title = e;
                }
            }
        }
    );
    searchString.value = prefs.searchString;
    searchString.dispatchEvent (new Event ('input'));
    //
    useRegex.addEventListener
    (
        'change',
        (event) => searchString.dispatchEvent (new Event ('input'))
    );
    //
    searchButton.addEventListener
    (
        'click',
        (event) =>
        {
            clearButton.click ();
            setTimeout
            (
                () =>
                {
                    let name = searchString.value;
                    if (name)
                    {
                        let regex = null;
                        try
                        {
                            function characterToEcmaScriptEscape (character)
                            {
                                let num = character.codePointAt (0);
                                let hex = num.toString (16).toUpperCase ();
                                return `\\u{${hex}}`;
                            }
                            //
                            let pattern = (useRegex.checked) ? name : Array.from (name).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                            if (wholeWord.checked)
                            {
                                const beforeWordBoundary =
                                (useES6Regex) ?
                                    '(?:^|[^\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])' :
                                    '(?:^|[^\\w])';
                                const afterWordBoundary =
                                (useES6Regex) ?
                                    '(?:$|[^\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])' :
                                    '(?:$|[^\\w])';
                                pattern = `${beforeWordBoundary}(${pattern})${afterWordBoundary}`;
                            }
                            const flags = 'ui';
                            if (useES6Regex)
                            {
                                pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                            }
                            regex = new RegExp (pattern, flags);
                        }
                        catch (e)
                        {
                        }
                        if (regex)
                        {
                            let emojiByName = findEmojiByName (regex);
                            inputString.focus ();
                            webContents.selectAll ();
                            webContents.replace (emojiByName.join (''));
                        }
                    }
                }
            );
        }
    );
    //
    inputString.value = prefs.inputString;
    //
    filterButton.addEventListener
    (
        'click',
        (event) =>
        {
            inputString.focus ();
            webContents.selectAll ();
            webContents.replace (getEmojiDataList (inputString.value).join (""));
        }
    );
    //
    function emptyDataList ()
    {
        while (emojiDataList.firstChild)
        {
           emojiDataList.firstChild.remove ();
        }
    }
    //
    function displayDataList (string)
    {
        let characters = getEmojiDataList (string);
        hitCount.textContent = `${characters.length}\xA0/\xA0${emojiKeys.length}`;
        for (let character of characters)
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
            let toolTip = "STATUS: " + (emojiList[character].toFullyQualified ? "DISPLAY/PROCESS": "KEYBOARD/PALETTE");
            emojiData.title = toolTip;
            if (emojiList[character].toFullyQualified)
            {
                names.classList.add ('non-fully-qualified');
                codes.classList.add ('non-fully-qualified');
            }
            secondRow.appendChild (codes);
            emojiData.appendChild (secondRow);
            emojiDataList.appendChild (emojiData);
        }
    }
    //
    displayDataList (inputString.value);
    inputString.addEventListener
    (
        'input',
        (event) =>
        {
            emptyDataList ();
            displayDataList (event.target.value);
        }
    );
    //
    references.open = prefs.references;
    //
    const emojiLinks = require ('../../lib/unicode/emoji-links.json');
    const linksList = require ('../../lib/links-list.js');
    //
    linksList (links, emojiLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        searchString: searchString.value,
        wholeWord: wholeWord.checked,
        useRegex: useRegex.checked,
        inputString: inputString.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
