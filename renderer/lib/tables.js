//
module.exports.create = function (fields, hidden, rows, sortIndex)
{
    let table = document.createElement ('table');
    let header = document.createElement ('tr');
    for (let field of fields)
    {
        let th;
        th = document.createElement ('th');
        th.className = field.className;
        if (field.lang)
        {
            th.lang = field.lang;
        }
        th.textContent = field.label;
        header.appendChild (th);
    }
    table.appendChild (header);
    for (let index = 0; index < rows.length; index++)
    {
        let row = rows[sortIndex[index]];
        let tr = document.createElement ('tr');
        for (let field of fields)
        {
            let td;
            td = document.createElement ('td');
            td.className = field.className;;
            if (field.lang)
            {
                td.lang = field.lang;
            }
            td.textContent = row[field.key];
            tr.appendChild (td);
        }
        table.appendChild (tr);
    }
    let message = document.createElement ('tr');
    message.setAttribute ('hidden', '');
    td = document.createElement ('td');
    td.setAttribute ('colspan', fields.length);
    td.className = hidden.className;
    if (hidden.lang)
    {
        td.lang = hidden.lang;
    }
    td.textContent = hidden.label;
    message.appendChild (td);
    table.appendChild (message);
    table.appendChild (header.cloneNode (true));
    return table;
}
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
