//
const unit = document.getElementById ('unicode-data-finder-unit');
//
const searchString = unit.querySelector ('.search-string');
const wholeWord = unit.querySelector ('.whole-word');
const useRegex = unit.querySelector ('.use-regex');
const searchButton = unit.querySelector ('.search-button');
const searchInfo = unit.querySelector ('.search-info');
const paginationBar = unit.querySelector ('.pagination-bar');
const firstPageButton = unit.querySelector ('.first-page-button');
const prevPageButton = unit.querySelector ('.prev-page-button');
const pageSelect = unit.querySelector ('.page-select');
const nextPageButton = unit.querySelector ('.next-page-button');
const lastPageButton = unit.querySelector ('.last-page-button');
const pageInfo = unit.querySelector ('.page-info');
const pageSizeSelect = unit.querySelector ('.page-size-select');
const searchByNameData = unit.querySelector ('.search-by-name-data');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const unicode = require ('../../lib/unicode/unicode.js');
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
        pageSize: 1024,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const deferredSymbols = true;
    //
    let characters;
    let charactersPages;
    let charactersPageIndex;
    //
    firstPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (charactersPageIndex > 0)
            {
                charactersPageIndex = 0;
                displayDataPage (charactersPages[charactersPageIndex]);
            }
        }
    );
    //
    prevPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (charactersPageIndex > 0)
            {
                charactersPageIndex = charactersPageIndex - 1;
                displayDataPage (charactersPages[charactersPageIndex]);
            }
        }
    );
    //
    pageSelect.addEventListener
    (
        'input',
        (event) =>
        {
            if (event.target.value !== "")
            {
                if (event.target.value < 1)
                {
                    event.target.value = 1;
                }
                else if (event.target.value > charactersPages.length)
                {
                    event.target.value = charactersPages.length;
                }
                charactersPageIndex = event.target.value - 1;
                displayDataPage (charactersPages[charactersPageIndex]);
            }
        }
    );
    //
    pageSelect.addEventListener
    (
        'blur',
        (event) =>
        {
            if (event.target.value === "")
            {
                event.target.value = charactersPageIndex + 1;
            }
        }
    );
    //
    nextPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (charactersPageIndex < (charactersPages.length - 1))
            {
                charactersPageIndex = charactersPageIndex + 1;
                displayDataPage (charactersPages[charactersPageIndex]);
            }
        }
    );
    //
    lastPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (charactersPageIndex < (charactersPages.length - 1))
            {
                charactersPageIndex = charactersPages.length - 1;
                displayDataPage (charactersPages[charactersPageIndex]);
            }
        }
    );
    //
    function updatePaginationBar ()
    {
        firstPageButton.disabled = (charactersPageIndex === 0);
        prevPageButton.disabled = (charactersPageIndex === 0);
        if (pageSelect.value !== (charactersPageIndex + 1))
        {
            pageSelect.value = charactersPageIndex + 1;
        }
        pageSelect.disabled = (charactersPages.length === 1);
        nextPageButton.disabled = (charactersPageIndex === (charactersPages.length - 1));
        lastPageButton.disabled = (charactersPageIndex === (charactersPages.length - 1));
    }
    //
    function removeDataPage ()
    {
        if (searchByNameData.firstChild)
        {
            searchByNameData.firstChild.remove ();
        }
    }
    //
    function displayDataPage (characters)
    {
        updatePaginationBar ();
        removeDataPage ();
        let observer;
        if (deferredSymbols)
        {
            observer = new IntersectionObserver
            (
                (entries, observer) =>
                {
                    entries.forEach
                    (
                        entry =>
                        {
                            if (entry.isIntersecting)
                            {
                                let symbol = entry.target;
                                if (symbol.textContent !== symbol.dataset.character)
                                {
                                    symbol.textContent = symbol.dataset.character;
                                    observer.unobserve (symbol);
                                }
                            }
                        }
                    );
                },
                { root: unit, rootMargin: '50% 0%' }
            );
        }
        let table = document.createElement ('table');
        table.className = 'data-table';
        let header = document.createElement ('tr');
        header.className = 'header';
        let symbolHeader = document.createElement ('th');
        symbolHeader.className = 'symbol-header';
        symbolHeader.textContent = "Symbol";
        header.appendChild (symbolHeader);
        let codePointHeader = document.createElement ('th');
        codePointHeader.className = 'code-point-header';
        codePointHeader.textContent = "Code\xA0Point";
        header.appendChild (codePointHeader);
        let nameHeader = document.createElement ('th');
        nameHeader.className = 'name-header';
        nameHeader.textContent = "Name";
        header.appendChild (nameHeader);
        table.appendChild (header);
        for (let character of characters)
        {
            let data = unicode.getCharacterBasicData (character);
            let row = document.createElement ('tr');
            row.className = 'row';
            let symbol = document.createElement ('td');
            symbol.className = 'symbol';
            if (deferredSymbols)
            {
                symbol.textContent = "\xA0";
                symbol.dataset.character = ((data.name === "<control>") || (character === " ")) ? "\xA0" : data.character;
                observer.observe (symbol);
            }
            else
            {
                symbol.textContent = ((data.name === "<control>") || (character === " ")) ? "\xA0" : data.character;
            }
            row.appendChild (symbol);
            let codePoint = document.createElement ('td');
            codePoint.className = 'code-point';
            codePoint.textContent = data.codePoint;
            row.appendChild (codePoint);
            let names = document.createElement ('td');
            names.className = 'names';
            let name = document.createElement ('div');
            name.className = 'name';
            name.textContent = data.name;
            names.appendChild (name);
            if (data.alias)
            {
                let alias = document.createElement ('div');
                alias.className = 'alias';
                alias.textContent = data.alias;
                names.appendChild (alias);
            }
            if (data.correction)
            {
                let alias = document.createElement ('div');
                alias.className = 'correction';
                alias.textContent = data.correction;
                alias.title = "CORRECTION";
                names.appendChild (alias);
            }
            row.appendChild (names);
            table.appendChild (row);
        }
        searchByNameData.appendChild (table);
    }
    //
    wholeWord.checked = prefs.wholeWord;
    useRegex.checked = prefs.useRegex;
    //
    searchString.placeholder = "Name or alias...";
    searchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
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
    pageSizeSelect.value = prefs.pageSize;
    if (pageSizeSelect.selectedIndex < 0) // -1: no element is selected
    {
        pageSizeSelect.selectedIndex = 0;
    }
    //
    function paginate (pageSize)
    {
        charactersPages = [ ];
        for (let startIndex = 0; startIndex < characters.length; startIndex += pageSize)
        {
            charactersPages.push (characters.slice (startIndex, startIndex + pageSize));
        }
        charactersPageIndex = 0;
        let pageCount = charactersPages.length;
        firstPageButton.title = `First page`;
        prevPageButton.title = `Previous page`;
        pageSelect.min = 1;
        pageSelect.max = pageCount;
        pageSelect.value = charactersPageIndex + 1;
        pageSelect.title = `Current page`;
        nextPageButton.title = `Next page`;
        lastPageButton.title = `Last page`;
        pageInfo.innerHTML = (pageCount > 1) ? `(<strong>${pageCount}</strong>&nbsp;pages)` : "";
        paginationBar.hidden = false;
        displayDataPage (charactersPages[charactersPageIndex]);
    }
    //
    pageSizeSelect.addEventListener
    (
        'input',
        (event) =>
        {
            paginate (parseInt (event.target.value));
        }
    );
    //
    searchButton.addEventListener
    (
        'click',
        (event) =>
        {
            searchInfo.textContent = "";
            paginationBar.hidden = true;
            removeDataPage ();
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
                            let start = window.performance.now ();
                            characters = unicode.findCharactersByName (regex);
                            let stop = window.performance.now ();
                            let seconds = ((stop - start) / 1000).toFixed (2);
                            searchInfo.innerHTML = `Results: <strong>${characters.length}</strong>&nbsp;/&nbsp;${unicode.characterCount} (${seconds}&nbsp;seconds)`;
                            if (characters.length > 0)
                            {
                                paginate (parseInt (pageSizeSelect.value));
                            }
                        }
                    }
                }
            );
        }
    );
    //
    references.open = prefs.references;
    //
    const unicodeLinks = require ('../../lib/unicode/unicode-links.json');
    const linksList = require ('../../lib/links-list.js');
    //
    linksList (links, unicodeLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        searchString: searchString.value,
        wholeWord: wholeWord.checked,
        useRegex: useRegex.checked,
        pageSize: pageSizeSelect.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
