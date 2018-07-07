//
const unit = document.getElementById ('emoji-picture-book-unit');
//
const selectGroup = unit.querySelector ('.select-group');
const groupContainer = unit.querySelector ('.group-container');
const references = unit.querySelector ('.references');
//
const titleDebugMode = unit.querySelector ('h1');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        selectGroup: "",
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    let debugMode = false;
    //
    titleDebugMode.addEventListener
    (
        'dblclick',
        (event) =>
        {
            event.preventDefault ();
            let isCommandOrControlDoubleClick = (process.platform === 'darwin') ? event.metaKey : event.ctrlKey;
            if (isCommandOrControlDoubleClick)
            {
                debugMode = !debugMode;
                event.target.classList.toggle ('debug');
                updateGroup (selectGroup.value);
            }
        }
    );
    //
    const emojiList = require ('../../lib/unicode/get-emoji-list.js') ("11.0");
    //
    const groups = require ('../../lib/unicode/get-emoji-groups.js') ("11.0");
    //
    let groupNames = [ ];
    for (let group of groups)
    {
        groupNames.push (group.name)
    }
    //
    for (let groupName of groupNames)
    {
        let option = document.createElement ('option');
        option.textContent = groupName;
        selectGroup.appendChild (option);
    }
    //
    function canvasCharacterWidth (character)
    {
        const size = 100;
        let canvas = document.createElement ('canvas');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext ('2d', { alpha: false });
        ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
        return ctx.measureText (character).width;
    }
    //
    const unsupportedCharacterWidth = canvasCharacterWidth ("\uFFFE");
    //
    function isSupportedCharacter (character)
    {
        let isSupported = true;
        let foundTagFlagCharacter = character.match (/^(🏴)[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]+\u{E007F}$/u)
        if (foundTagFlagCharacter)
        {
            if (canvasCharacterWidth (character) === canvasCharacterWidth (foundTagFlagCharacter[1]))
            {
                isSupported = false;
            }
        }
        else
        {
            character = character.replace (/^(.)[🏻-🏿].*/u, '$1');
            if (canvasCharacterWidth (character) === unsupportedCharacterWidth)
            {
                isSupported = false;
            }
        }
        return isSupported;
    }
    //
    function getEmojiToolTip (emoji)
    {
        let toolTip = emojiList[emoji].name.toUpperCase ();
        let flagFound = emoji.match (/^([🇦-🇿])([🇦-🇿])$/u);
        if (flagFound)
        {
            let firstLetter = String.fromCodePoint (flagFound[1].codePointAt (0) - "🇦".codePointAt (0) + "A".codePointAt (0));
            let secondLetter = String.fromCodePoint (flagFound[2].codePointAt (0) - "🇦".codePointAt (0) + "A".codePointAt (0));
            toolTip += ` [${firstLetter}${secondLetter}]`;
        }
        else
        {
            let flagTagFound = emoji.match (/^🏴([\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]+)\u{E007F}$/u);
            if (flagTagFound)
            {
                let letters = Array.from (flagTagFound[1]).map ((tag) => String.fromCodePoint (tag.codePointAt (0) - 0xE0000));
                toolTip += ` [${letters.join ('').toUpperCase ().replace (/^(..)(...)$/, "$1-$2")}]`;
            }
        }
        toolTip += "\n" + emojiList[emoji].code;
        return toolTip;
    }
    //
    function updateGroup (groupName)
    {
        while (groupContainer.firstChild)
        {
           groupContainer.firstChild.remove ();
        }
        for (let group of groups)
        {
            if (group.name === groupName)
            {
                for (let subgroup of group.subgroups)
                {
                    let panel = document.createElement ('div');
                    panel.className = 'plain-panel';
                    let h2 = document.createElement ('h2');
                    h2.textContent = subgroup.name;
                    panel.appendChild (h2);
                    let sheet = document.createElement ('div');
                    sheet.className = 'sheet';
                    let characters = subgroup.characters;
                    for (let character of characters)
                    {
                        if (character)
                        {
                            if (character in emojiList)
                            {
                                if (emojiList[character].fullyQualified)
                                {
                                    character = emojiList[character].fullyQualified;
                                    console.log (character);
                                }
                                let span =  document.createElement ('span');
                                span.className = 'emoji';
                                span.textContent = character;
                                span.title = getEmojiToolTip (character);
                                sheet.appendChild (span);
                            }
                        }
                        else
                        {
                            let div = document.createElement ('div');
                            sheet.appendChild (div);
                        }
                    }
                    panel.appendChild (sheet);
                    groupContainer.appendChild (panel);
                    //
                    let spans = panel.getElementsByClassName ('emoji');
                    let removedSpans = [ ];
                    for (let span of spans)
                    {
                        if (!isSupportedCharacter (span.textContent) || (span.scrollWidth > span.clientWidth))
                        {
                            let saveCharacter = span.textContent;
                            let removeSpan = true;
                            let altCharacters = emojiList[saveCharacter].nonFullyQualified;
                            if (altCharacters)
                            {
                                for (let altCharacter of altCharacters)
                                {
                                    span.textContent = altCharacter;
                                    if (isSupportedCharacter (span.textContent) && (!(span.scrollWidth > span.clientWidth)))
                                    {
                                        span.title = getEmojiToolTip (altCharacter);
                                        removeSpan = false;
                                        break;
                                    }
                                }
                                if (removeSpan)
                                {
                                    span.textContent = saveCharacter;
                                    span.title = getEmojiToolTip (saveCharacter);
                                }
                            }
                            if (removeSpan)
                            {
                                removedSpans.push (span);
                            }
                        }
                    }
                    if (!debugMode)
                    {
                        removedSpans.forEach ((span) => { span.remove (); });
                    }
                    //
                    let count = panel.getElementsByClassName ('emoji').length;
                    if (count === 0)
                    {
                        panel.remove ();
                    } 
                }
            }
        }
    }
    //
    selectGroup.value = prefs.selectGroup;
    if (selectGroup.selectedIndex < 0) // -1: no element is selected
    {
        selectGroup.selectedIndex = 0;
    }
    updateGroup (selectGroup.value);
    selectGroup.addEventListener ('input', (event) => { updateGroup (event.target.value); });
    //
    references.open = prefs.references;
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        selectGroup: selectGroup.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
