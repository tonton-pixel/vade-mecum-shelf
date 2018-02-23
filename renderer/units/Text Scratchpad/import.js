//
const unit = document.getElementById ('text-scratchpad-unit');
//
const textString = unit.querySelector ('.text-string');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        textString: ""
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    textString.value = prefs.textString;
};
//
module.exports.stop = function (context)
{
    context.setPrefs ({ textString: textString.value });
};
//
