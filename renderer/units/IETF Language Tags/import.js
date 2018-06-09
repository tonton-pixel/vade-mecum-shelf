//
const unit = document.getElementById ('ietf-language-tags-unit');
//
const references = unit.querySelector ('.references');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        references: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    references.open = prefs.references;
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
