//
const unit = document.getElementById ('json-formatter-unit');
//
const inputString = unit.querySelector ('.input-string');
const clearButton = unit.querySelector ('.clear-button');
const outputString = unit.querySelector ('.output-string');
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs = { inputString: "{\"First Name\":\"Albert\",\"Last Name\":\"Einstein\",\"Genius\":true,\"Known for\":[\"Photoelectric effect\",\"Brownian motion\",\"Special relativity\",\"General relativity\"]}" };
    let prefs = getPrefs (defaultPrefs);
    //
    const json = require ('./json.js');
    //
    const { remote } = require ('electron');
    const contents = remote.getCurrentWebContents ();
    //
    function reformat (input)
    {
        let error = false;
        let output = '';
        if (input)
        {
            try
            {
                output = json.stringify (json.parse (input), '\t');
            }
            catch (e)
            {
                output = e.message;
                error = true;
            }
        }
        outputString.value = output;
        if (error)
        {
            outputString.classList.add ('rendering-error');
        }
        else
        {
            outputString.classList.remove ('rendering-error');
        }
    }
    //
    reformat (inputString.value = prefs.inputString);
    inputString.addEventListener ('input', (event) => reformat (event.target.value));
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            inputString.focus ();
            contents.selectAll ();
            contents.delete ();
        }
    );
};
//
module.exports.stop = function (context, setPrefs)
{
    setPrefs ({ inputString: inputString.value });
};
//
