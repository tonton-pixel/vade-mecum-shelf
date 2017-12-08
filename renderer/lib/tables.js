//
module.exports.buildKeyIndex = function (table, key, compareFunction)
{
    // let keyIndex = Array.from (new Array (table.length), (x, i) => i);
    let keyIndex = [ ];
    for (let index = 0; index < table.length; index++)
    {
        keyIndex.push (index);
    }
    keyIndex.sort ((a, b) => compareFunction (table[a][key], table[b][key]) || (a - b)); // Preserve order
    return keyIndex;
};
//
module.exports.searchData = function (table, searchString)
{
    let matchingRowCount = -1;
    if (searchString.length > 0)
    {
        matchingRowCount = 0;
        let removedRows = [ ];
        let rows = table.getElementsByTagName ("tr");
        for (let row of rows)
        {
            if (!row.hidden) // !row.hasAttribute ('hidden')
            {
                let match = false;
                let columns = row.getElementsByTagName ("td");
                if (columns.length > 0)
                {
                    for (let column of columns)
                    {
                        if (column.textContent.toUpperCase ().indexOf (searchString.toUpperCase ()) > -1)
                        {
                            match = true;
                            matchingRowCount++;
                            break;
                        }
                    }
                    if (!match) removedRows.push (row);
                }
            }
        }
        for (let removedRow of removedRows)
        {
            removedRow.remove ();
        }
    }
    return (matchingRowCount);
};
//
