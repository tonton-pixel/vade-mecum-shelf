//
function hasDesiredType (types)
{
    return (!types.includes ('text/plain')) && types.includes ('Files');
}
//
function getSingleFilePath (files)
{
    let filePath = null;
    if ((files.length === 1) && fs.statSync (files[0].path).isFile ())
    {
        filePath = fs.realpathSync (files[0].path);
    }
    return filePath;
}
//
module.exports = function (dropZone, dropFilter, dropAction)
{
    let count = 0;
    //
    dropZone.ondragenter = (event) =>
    {
        if (hasDesiredType (event.dataTransfer.types))
        {
            event.stopPropagation ();
            event.preventDefault ();
            if (count++ === 0)
            {
                event.currentTarget.classList.add ('overlay');
            }
        }
    };
    //
    dropZone.ondragover = (event) =>
    {
        if (hasDesiredType (event.dataTransfer.types))
        {
            event.stopPropagation ();
            event.preventDefault ();
        }
    };
    //
    dropZone.ondragleave = (event) =>
    {
        if (hasDesiredType (event.dataTransfer.types))
        {
            event.stopPropagation ();
            event.preventDefault ();
            if (--count === 0)
            {
                event.currentTarget.classList.remove ('overlay');
            }
        }
    };
    //
    dropZone.ondrop = (event) =>
    {
        if (hasDesiredType (event.dataTransfer.types))
        {
            event.stopPropagation ();
            event.preventDefault ();
            count = 0;
            event.currentTarget.classList.remove ('overlay');
            let filePath = getSingleFilePath (event.dataTransfer.files);
            if (filePath)
            {
                textField2.focus ();
                webContents.selectAll ();
                webContents.replace (filePath);
            }
            else
            {
                remote.shell.beep ();
            }
        }
        event.dataTransfer.clearData ();
    };
};
//
