//
// Lightweight XML to JSON parser:
// Any text surrounding tag(s) is purely and simply ignored...
//
function parseElement (element)
{
    let json = { };
    if (element.hasAttributes ())
    {
        for (let attribute of element.attributes)
        {
            json["@" + attribute.name] = attribute.value;
        }
    }
    if (element.children.length > 0)
    {
        for (let child of element.children)
        {
            if (child.tagName in json)
            {
                if (!Array.isArray (json[child.tagName]))
                {
                    json[child.tagName] = [ json[child.tagName] ];
                }
                json[child.tagName].push (parseElement (child));
            }
            else
            {
                json[child.tagName] = parseElement (child);
            }
        }
    }
    else if (element.hasAttributes ())
    {
        if (element.textContent)
        {
            json["#text"] = element.textContent;
        }
    }
    else
    {
        json = element.textContent || null;
    }
    return json;
}
//
module.exports.parse = function (xml)
{
    let json = { };
    let parser = new DOMParser ();
    let doc = parser.parseFromString (xml, "application/xml");
    let root = doc.firstElementChild;
    if (root)
    {
        json[root.tagName] = parseElement (root);
    }
    return json;
}
//
