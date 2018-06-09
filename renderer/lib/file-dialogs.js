//
const { remote } = require ('electron');
const { dialog, getCurrentWindow } = remote;
//
const fs = require ('fs');
//
module.exports.loadTextFile = function (prompt, filters, defaultPath, encoding, callback)
{
    dialog.showOpenDialog
    (
        getCurrentWindow (),
        {
            title: prompt,
            message: prompt,
            filters: filters,
            defaultPath: defaultPath
        },
        (filePaths) =>
        {
            if (filePaths)
            {
                let filePath = filePaths[0];
                fs.readFile
                (
                    filePath,
                    encoding,
                    (err, data) =>
                    {
                        if (err)
                        {
                            alert ("An error ocurred reading the file: " + err.message);
                        }
                        else
                        {
                            callback (data, filePath);
                        }
                    }
                );
            }
        }
    );
}
//
module.exports.saveTextFile = function (prompt, filters, defaultPath, callback)
{
    dialog.showSaveDialog
    (
        getCurrentWindow (),
        {
            title: prompt,
            message: prompt,
            filters: filters,
            defaultPath: defaultPath
        },
        (filePath) =>
        {
            if (filePath)
            {
                fs.writeFile
                (
                    filePath,
                    callback (filePath),
                    (err) =>
                    {
                        if (err)
                        {
                            alert ("An error ocurred writing the file: " + err.message);
                        }
                    }
                );
            }
        }
    );
};
//
