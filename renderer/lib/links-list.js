//
module.exports = function (linksElement, linksArray)
{
    linksArray.forEach
    (
        group =>
        {
            let ul = document.createElement ('ul');
            group.forEach
            (
                link =>
                {
                    let li = document.createElement ('li');
                    let a = document.createElement ('a');
                    a.href = link.href;
                    a.title = decodeURI (link.href);
                    if (link.lang)
                    {
                        a.lang = link.lang;
                    }
                    a.textContent = link.name;
                    li.appendChild (a);
                    ul.appendChild (li);
                }
            );
            linksElement.appendChild (ul);
        }
    );
}
//
