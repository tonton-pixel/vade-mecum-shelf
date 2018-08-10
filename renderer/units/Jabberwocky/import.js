//
const unit = document.getElementById ('jabberwocky-unit');
//
const poemContainer = unit.querySelector ('.poem-container');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const url = require ('url');
    //
    const poem = require ('./poem.json');
    //
    let panel = document.createElement ('div');
    panel.className = 'plain-panel';
    let combiBox = document.createElement ('div');
    combiBox.className = 'combi-box';
    let illustrationBox = document.createElement ('div');
    illustrationBox.className = 'illustration';
    const xmlns= 'http://www.w3.org/2000/svg';
    let svg = document.createElementNS (xmlns, 'svg');
    let use = document.createElementNS (xmlns, 'use');
    use.setAttributeNS (null, 'href', url.resolve (context.baseURL, 'illustrations.svg#enluminure-5-poster'));
    svg.appendChild (use);
    illustrationBox.appendChild (svg);
    combiBox.appendChild (illustrationBox);
    let stanzasBox = document.createElement ('div');
    stanzasBox.className = 'stanzas';
    let stanzas = poem["text"];
    for (let stanzaIndex = 0; stanzaIndex < stanzas.length; stanzaIndex++)
    {
        let stanza = stanzas[stanzaIndex];
        let stanzaContainer = document.createElement ('p');
        stanzaContainer.className = 'stanza';
        for (let lineIndex = 0; lineIndex < stanza.length; lineIndex++)
        {
            let line = stanza[lineIndex];
            let lineContainer = document.createElement ('span');
            lineContainer.className = 'line';
            lineContainer.textContent = line;
            stanzaContainer.appendChild (lineContainer);
            if (lineIndex < (stanza.length - 1))
            {
                stanzaContainer.appendChild (document.createElement ('br'));
            }
        }
        stanzasBox.appendChild (stanzaContainer);
        if (stanzaIndex < (stanzas.length - 1))
        {
            stanzasBox.appendChild (document.createElement ('br'));
        }
    }
    let author = document.createElement ('div');
    author.className = 'author';
    author.textContent = `— ${poem.author} —`;
    stanzasBox.appendChild (author);
    combiBox.appendChild (stanzasBox);
    panel.appendChild (combiBox);
    poemContainer.appendChild (panel);
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
        references: references.open
    };
    context.setPrefs (prefs);
};
//
