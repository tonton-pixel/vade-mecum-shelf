//
const { remote, ipcRenderer, shell, webFrame } = require ('electron');
//
const fs = require ('fs');
const path = require ('path');
const url = require ('url');
//
const appName = remote.app.getName ();
const appVersion = remote.app.getVersion ();
//
const settings = remote.getGlobal ('settings');
//
if (!settings.smartZoom)
{
    webFrame.setVisualZoomLevelLimits (1, 1);  // Disable smart zoom (double-tap and pinch)
}
//
if (settings.unitsMenu)
{
    ipcRenderer.send ('update-units-menu', [ ]);
}
//
// Collect units information
let categories = { };
let categoryNames = [ ];
let unitNames = [ ];
let unitElements = { };
let unitImports = [ ];
//
let unitsDirname = path.join (__dirname, 'units');
let unitsFilenames = fs.readdirSync (unitsDirname);
//
let unitFilenames = [ ];
//
for (let unitsFilename of unitsFilenames)
{
    if (unitsFilename[0] !== '.') // Skip hidden files and folders (.DS_Store, etc.)
    {
        let unitDirname = path.join (unitsDirname, unitsFilename);
        if (fs.statSync (unitDirname).isDirectory () && (unitsFilename[0] !== '~')) // Skip units whose name begins with a tilde character
        {
            unitFilenames.push (unitsFilename);
        }
    }
}
// Sort unit names
unitFilenames.sort ((a, b) => a.localeCompare (b));
//
function getConfig (configFile)
{
    let config = { };
    if (fs.existsSync (configFile))
    {
        try
        {
            config = require (configFile);
        }
        catch (e)
        {
            console.log ("JSON parsing error:", e.message);
        }
    }
    return config;
}
//
function pathToURL (pathname)
{
    // Assume that renderer.js and index.html share the same __dirname
    return url.resolve ('', url.format ({ pathname: path.relative (__dirname, pathname) }));
}
//
for (let unitFilename of unitFilenames)
{
    let unitDirname = path.join (unitsDirname, unitFilename);
    const
    {
        category = settings.noCategoryName,
        description = "",
        disabled = false
    } = getConfig (path.join (unitDirname, 'config.json'));
    if (!disabled)
    {
        let htmlFilename = path.join (unitDirname, 'import.html');
        if (fs.existsSync (htmlFilename))
        {
            if (!(category in categories))
            {
                categories[category] = [ ];
                categoryNames.push (category);
            }
            categories[category].push (unitFilename);
            //
            let unitImport = { };
            //
            unitImport.name = unitFilename;
            unitImport.category = category;
            unitImport.URL = pathToURL (htmlFilename);
            //
            let filename = path.join (unitDirname, 'import.js');
            if (fs.existsSync (filename))
            {
                unitImport.dirname = unitDirname;
                unitImport.filename = filename;
            }
            //
            let cssFilename = path.join (unitDirname, 'import.css');
            if (fs.existsSync (cssFilename))
            {
                unitImport.cssURL = pathToURL (cssFilename);
            }
            //
            unitImports.push (unitImport);
            //
            unitElements[unitFilename] = { };
            //
            unitNames.push (unitFilename);
        }
    }
}
// Sort category names
categoryNames.sort ((a, b) => a.localeCompare (b));
//
function selectUnit (unitName)
{
    if (unitName !== currentUnitName)
    {
        let uncategorizedNavButton = unitElements[unitName].uncategorizedNavButton;
        uncategorizedNavButton.classList.add ('is-selected');
        let currentUncategorizedNavButton = unitElements[currentUnitName].uncategorizedNavButton;
        currentUncategorizedNavButton.classList.remove ('is-selected');
        //
        let categorizedNavButton = unitElements[unitName].categorizedNavButton;
        categorizedNavButton.classList.add ('is-selected');
        let currentCategorizedNavButton = unitElements[currentUnitName].categorizedNavButton;
        currentCategorizedNavButton.classList.remove ('is-selected');
        //
        let section= unitElements[unitName].section;
        section.classList.add ('is-shown');
        document.title = settings.window.titleTemplate.replace ('{app}', appName).replace ('{unit}', unitName);
        let currentSection = unitElements[currentUnitName].section;
        currentSection.classList.remove ('is-shown');
        //
        currentUnitName = unitName;
    }
}
//
let sidebar = document.createElement ('aside');
sidebar.className = 'sidebar';
let header = document.createElement ('header');
header.className = 'header';
sidebar.appendChild (header);
let navigation = document.createElement ('nav');
navigation.className = 'navigation';
sidebar.appendChild (navigation);
let footer = document.createElement ('footer');
footer.className = 'footer';
sidebar.appendChild (footer);
document.body.appendChild (sidebar);
let contents = document.createElement ('main');
contents.className = 'contents';
document.body.appendChild (contents);
//
const Storage = require ('../lib/storage.js');
const rendererStorage = new Storage ('renderer-preferences');
//
const defaultPrefs =
{
    currentUnitName: "",
    showSidebar: true,
    showCategories: true
};
let prefs = rendererStorage.get (defaultPrefs);
let currentUnitName = prefs.currentUnitName;
let showSidebar = prefs.showSidebar;
let showCategories = prefs.showCategories;
//
if (!unitNames.includes (currentUnitName))
{
    currentUnitName = unitNames[0];
}
//
let h1 = document.createElement ('h1');
h1.className = 'app-title';
let primary = document.createElement ('span');
primary.className = 'primary';
let suffixPos = appName.lastIndexOf (" ");
primary.textContent = appName.slice (0, suffixPos);
h1.appendChild (primary);
let secondary = document.createElement ('span');
secondary.className = 'secondary';
secondary.textContent= appName.substr (suffixPos);
h1.appendChild (secondary);
header.appendChild (h1);
//
// Categorized navigation
let categorizedNav = document.createElement ('div');
categorizedNav.className = 'categorized-nav';
for (let categoryName of categoryNames)
{
    let navItem = document.createElement ('div');
    navItem.className = 'nav-item';
    let navCategory = document.createElement ('div');
    navCategory.className = 'nav-category';
    navCategory.innerHTML = '<svg class="nav-icon"><use href="images/symbols.svg#shelf-symbol"></use></svg>';
    navCategory.appendChild (document.createTextNode (categoryName));
    navItem.appendChild (navCategory);
    let unitNames = categories[categoryName];
    for (let unitName of unitNames)
    {
        let navButton = document.createElement ('div');
        navButton.className = 'nav-button';
        if (unitName === currentUnitName)
        {
            navButton.classList.add ('is-selected');
        }
        navButton.onclick = function ()
        {
            selectUnit (this.textContent);
            if (settings.unitsMenu)
            {
                ipcRenderer.send ('sync-units-menu', this.textContent);
            }
        };
        navButton.textContent = unitName;
        navItem.appendChild (navButton);
        unitElements[unitName].categorizedNavButton = navButton;
    }
    categorizedNav.appendChild (navItem);
}
navigation.appendChild (categorizedNav);
//
// Uncategorized navigation
let uncategorizedNav = document.createElement ('div');
uncategorizedNav.className = 'uncategorized-nav';
let navItem = document.createElement ('div');
navItem.className = 'nav-item';
let navCategory = document.createElement ('div');
navCategory.className = 'nav-category';
navCategory.innerHTML = '<svg class="nav-icon"><use href="images/symbols.svg#shelf-symbol"></use></svg>';
navCategory.appendChild (document.createTextNode (settings.unitsName));
navItem.appendChild (navCategory);
for (let unitName of unitNames)
{
    let navButton = document.createElement ('div');
    navButton.className = 'nav-button';
    if (unitName === currentUnitName)
    {
        navButton.classList.add ('is-selected');
    }
    navButton.onclick = function ()
    {
        selectUnit (this.textContent);
        if (settings.unitsMenu)
        {
            ipcRenderer.send ('sync-units-menu', this.textContent);
        }
    };
    navButton.textContent = unitName;
    navItem.appendChild (navButton);
    unitElements[unitName].uncategorizedNavButton = navButton;
}
uncategorizedNav.appendChild (navItem);
navigation.appendChild (uncategorizedNav);
//
let paragraph = document.createElement ('p');
paragraph.innerHTML = `${appName} v${appVersion}<br>${settings.copyright}`;
footer.appendChild (paragraph);
let div = document.createElement ('div');
div.innerHTML = '<svg class="app-color-icon"><use href="images/icons.svg#app-color-icon"></use></svg>';
footer.appendChild (div);
// Easter egg...
const electronAppURL = 'https://electronjs.org/apps/vade-mecum-shelf';
div.querySelector ('use').addEventListener ('dblclick', () => { shell.openExternal (electronAppURL); });
//
ipcRenderer.on
(
    'toggle-sidebar',
    () =>
    {
        if (sidebar.classList.contains ('no-transition'))
        {
            sidebar.classList.remove ('no-transition');
        }
        sidebar.classList.toggle ('is-shown');
        showSidebar = !showSidebar;
    }
);
//
function toggleCategories (show)
{
    if (show)
    {
        uncategorizedNav.classList.remove ('is-shown');
        categorizedNav.classList.add ('is-shown');
    }
    else
    {
        categorizedNav.classList.remove ('is-shown');
        uncategorizedNav.classList.add ('is-shown');
    }
}
//
ipcRenderer.on
(
    'toggle-categories',
    () =>
    {
        showCategories = !showCategories;
        toggleCategories (showCategories);
    }
);
//
// Resolve src and href attributes relatively to each unit base for relative links,
// or to the main index.html for root-relative links
function resolveURLs (node, baseURL)
{
    function resolveURL (URL)
    {
        if (URL[0] !== '#')
        {
            URL = (URL[0] === '/') ? URL.slice (1) : url.resolve (baseURL, URL);
        }
        return URL;
    }
    //
    // <img> and <script> src attribute
    let srcAttributeTags = node.querySelectorAll ('img[src], script[src]');
    for (let srcAttributeTag of srcAttributeTags)
    {
        srcAttributeTag.setAttribute ('src', resolveURL (srcAttributeTag.getAttribute ('src').trim ()));
    }
    // <svg><use>, <svg><image> and <a> href attribute
    let hrefAttributeTags = node.querySelectorAll ('svg > use[href], svg > image[href], a[href]');
    for (let hrefAttributeTag of hrefAttributeTags)
    {
        hrefAttributeTag.setAttribute ('href', resolveURL (hrefAttributeTag.getAttribute ('href').trim ()));
    }
    // <img> and <source> srcset attribute
    let srcsetAttributeTags = node.querySelectorAll ('img[srcset], source[srcset]');
    for (let srcsetAttributeTag of srcsetAttributeTags)
    {
        let srcs = srcsetAttributeTag.getAttribute ('srcset').split (',');
        let resolvedSrcs = [ ];
        for (let src of srcs)
        {
            src = src.trim ();
            if (src)
            {
                let srcElements = src.split (/\s+/);
                srcElements[0] = resolveURL (srcElements[0]);
                resolvedSrcs.push (srcElements.join (' '));
            }
        }
        srcsetAttributeTag.setAttribute ('srcset', resolvedSrcs.join (', '));
    }
}
//
// Work-around a pretty common bug...
function fixSvgUseFromTemplate (node)
{
    let useTags = node.querySelectorAll ('svg > use');
    for (let useTag of useTags)
    {
        let svgTag = useTag.parentElement;
        svgTag.innerHTML = svgTag.innerHTML;
    }
}
//
function importUnit (template, unitImport)
{
    if (!template)
    {
        template = document.createElement ('template');
        template.innerHTML = '<section><p style="color: var(--color-error)">Error: missing &lt;template&gt; in import.html.</p></section>';
    }
    let templateNode = template.content.cloneNode (true);
    resolveURLs (templateNode, unitImport.URL);
    let section = templateNode.querySelector ('section');
    if (!section)
    {
        section = document.createElement ('section');
        section.innerHTML = '<p style="color: var(--color-error)">Error: missing &lt;section&gt; in import.html.</p>';
    }
    section.className = 'unit';
    let sectionTitle = document.createElement ('h1');
    sectionTitle.className = 'unit-title';
    sectionTitle.innerHTML = '<svg class="title-icon"><use href="images/symbols.svg#fisheye-symbol"></use></svg>&nbsp;&nbsp;';
    let h1 = section.querySelector ('h1');
    if (h1 && h1.innerHTML)
    {
        sectionTitle.innerHTML += h1.innerHTML;
    }
    else
    {
        let textNode = document.createTextNode (unitImport.name);
        sectionTitle.appendChild (textNode);
    }
    if (h1)
    {
        h1.remove ();
    }
    sectionTitle.normalize ();
    section.insertBefore (sectionTitle, section.firstChild);
    if (unitImport.name === currentUnitName)
    {
        section.classList.add ('is-shown');
        document.title = settings.window.titleTemplate.replace ('{app}', appName).replace ('{unit}', unitImport.name);
    }
    contents.appendChild (section);
    fixSvgUseFromTemplate (section);
    unitElements[unitImport.name].section = section;
    if (unitImport.filename)
    {
        let unitModule = require (unitImport.filename);
        let id = section.id;
        if (id)
        {
            unitImport.storage = new Storage (`${id}-preferences`);
            let context = { baseURL: unitImport.URL, getPrefs: unitImport.storage.get, setPrefs: unitImport.storage.set };
            if (typeof unitModule === 'function')
            {
                unitModule (context);
            }
            else if (typeof unitModule.start === 'function')
            {
                unitModule.start (context);
            }
        }
    }
}
//
for (let unitImport of unitImports)
{
    if (unitImport.cssURL)
    {
        let cssLink = document.createElement ('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = unitImport.cssURL;
        document.head.appendChild (cssLink);
    }
}
//
for (let unitImport of unitImports)
{
    if (unitImport.URL)
    {
        let link = document.createElement ('link');
        link.rel = 'import';
        link.href = unitImport.URL;
        link.onload = function (event) { importUnit (this.import.querySelector ('template'), unitImport); };
        document.head.appendChild (link);
    }
}
//
window.addEventListener // *Not* document.addEventListener
(
    'beforeunload',
    () =>
    {
        let prefs =
        {
            currentUnitName: currentUnitName,
            showSidebar: showSidebar,
            showCategories: showCategories
        };
        rendererStorage.set (prefs);
        for (let unitImport of unitImports)
        {
            if (unitImport.filename)
            {
                let unitModule = require (unitImport.filename);
                if (unitImport.storage)
                {
                    let context = { baseURL: unitImport.URL, getPrefs: unitImport.storage.get, setPrefs: unitImport.storage.set };
                    if (typeof unitModule.stop === 'function')
                    {
                        unitModule.stop (context);
                    }
                }
            }
        }
    }
);
//
function addListeners ()
{
    // Get all external links to be opened in external browser
    let aTags = document.querySelectorAll ('a[href]');
    for (let aTag of aTags)
    {
        // if (aTag.href.match (/^http(s?)\:\/\//))
        if (aTag.href.startsWith ("http://") || aTag.href.startsWith ("https://"))
        {
            aTag.title = decodeURI (aTag.href);
            aTag.addEventListener
            (
                'click',
                (event) =>
                {
                    let isCommandOrControlClick = (process.platform === 'darwin') ? event.metaKey : event.ctrlKey;
                    event.preventDefault ();
                    shell.openExternal (event.target.href, { activate: !isCommandOrControlClick }); // options are macOS only anyway
                }
            );
        }
    }
}
//
remote.getCurrentWebContents ().once
(
    'did-finish-load', (event) =>
    {
        addListeners ();
        if (showSidebar)
        {
            sidebar.classList.add ('no-transition');
            sidebar.classList.add ('is-shown');
        }
        toggleCategories (showCategories);
        contents.classList.add ('is-shown');
        if (settings.unitsMenu)
        {
            ipcRenderer.send ('update-units-menu', unitNames, currentUnitName);
        }
        ipcRenderer.send ('show-window');
    }
);
//
ipcRenderer.on ('select-unit', (event, unitName) => { selectUnit (unitName); });
//
const scroll = require ('./lib/scroll.js');
//
ipcRenderer.on ( 'scroll-to-top', () => { scroll.toTop (unitElements[currentUnitName].section); } );
ipcRenderer.on ( 'scroll-to-bottom', () => { scroll.toBottom (unitElements[currentUnitName].section); } );
//
// Adapted from <https://github.com/ten1seven/track-focus>
(function (body)
{
    let mouseFocus;
    let bindEvents = function ()
    {
        body.addEventListener ('keydown', (event) => { mouseFocus = false; });
        body.addEventListener ('mousedown', (event) => { mouseFocus = true; });
        body.addEventListener ('focusin', (event) => { if (mouseFocus) event.target.classList.add ('mouse-focus'); });
        body.addEventListener ('focusout', (event) => { if (document.activeElement !== event.target) event.target.classList.remove ('mouse-focus'); });
    };
    bindEvents ();
}) (document.body);
//
