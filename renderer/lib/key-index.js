//
module.exports.build = function (table, key, compareFunction)
{
    // let keyIndex = Array.from (new Array (table.length), (x, i) => i);
    let keyIndex = [ ];
    for (let index = 0; index < table.length; index++)
    {
        keyIndex.push (index);
    }
    keyIndex.sort ((a, b) => compareFunction (table[a][key], table[b][key]) || (a - b)); // Preserve order (stable sort)
    return keyIndex;
};
//
