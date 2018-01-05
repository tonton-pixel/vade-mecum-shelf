//
const unit = document.getElementById ('text-scratchpad-unit');
//
const textString = unit.querySelector ('.text-string');
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs = { textString: "" };
    let prefs = getPrefs (defaultPrefs);
    //
    textString.value = prefs.textString;
};
//
module.exports.stop = function (context, setPrefs)
{
    setPrefs ({ textString: textString.value });
};
//
