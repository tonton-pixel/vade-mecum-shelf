//
const electron = require ('electron');
const path = require ('path');
const fs = require ('fs');
//
// Get a clone (deep copy) of a JSON-serializable data structure.
function cloneData (data)
{
    let clone;
    if (data === null)
    {
        clone = null;
    }
    else if (typeof data === 'object')
    {
        if (Array.isArray (data))
        {
            clone = [ ];
            for (let element of data)
            {
                clone.push (cloneData (element));
            }
        }
        else
        {
            clone = { };
            for (let key in data)
            {
                if (data.hasOwnProperty (key))
                {
                    clone[key] = cloneData (data[key]);
                }
            }
        }
    }
    else
    {
        clone = data;
    }
    return clone;
}
//
// Test if data is a plain object
function isPlainObject (data)
{
    return (data !== null) && (typeof data === 'object') && (!Array.isArray (data));
}
//
// Merge two literal object data structures, using the second one as default base.
function mergeData (data, defaultData)
{
    for (let key in defaultData)
    {
        if (defaultData.hasOwnProperty (key))
        {
            if (key in data)
            {
                if (isPlainObject (defaultData[key]))
                {
                    data[key] = mergeData (data[key], defaultData[key]);
                }
            }
            else
            {
                data[key] = cloneData (defaultData[key]);
            }
        }
    }
    return data;
}
//
module.exports = function (dataName)
{
    const userDataPath = (electron.app || require ('@electron/remote').app).getPath ('userData');
    const dataFilename = path.join (userDataPath, dataName + '.json');
    //
    this.get = function (defaultData)
    {
        let data = { };
        try
        {
            data = JSON.parse (fs.readFileSync (dataFilename, 'utf8'));
        }
        catch (e)
        {
        }
        return mergeData (data, defaultData);
    };
    //
    this.set = function (data)
    {
        try
        {
            fs.writeFileSync (dataFilename, JSON.stringify (data));
        }
        catch (e)
        {
        }
    };
    //
    this.remove = function ()
    {
        try
        {
            fs.unlinkSync (dataFilename);
        }
        catch (e)
        {
        }
    };
};
//
