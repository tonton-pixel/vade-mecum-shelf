//
const fs = require ('fs');
const path = require ('path');
//
// Copy of https://unicode.org/repos/cldr/tags/latest/common/annotations/en.xml
// Copy of https://unicode.org/repos/cldr/tags/latest/common/annotationsDerived/en.xml
//
function getAnnotations (dirname, filename)
{
    let result = { };
    let xml = fs.readFileSync (path.join (__dirname, 'cldr', dirname, filename), { encoding: 'utf8' });
    let parser = new DOMParser ();
    let doc = parser.parseFromString (xml, "application/xml");
    let annotations = doc.querySelectorAll ('annotations > annotation');
    for (let annotation of annotations)
    {
        let character = annotation.getAttribute ('cp');
        if (!(character in result))
        {
            result[character] = { };
        }
        if (annotation.hasAttribute ('type') && (annotation.getAttribute ('type') === 'tts'))
        {
            result[character].shortName = annotation.textContent;
        }
        else
        {
            result[character].keywords = annotation.textContent.split ('|').map ((keyword) => { return keyword.trim (); });
        }
    }
    return result;
}
//
module.exports = function (filename)
{
    let annotations = getAnnotations ('annotations', filename);
    Object.assign (annotations, getAnnotations ('annotationsDerived', filename));
    return annotations;
};
//
