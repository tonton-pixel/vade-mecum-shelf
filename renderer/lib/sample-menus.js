//
const { remote } = require ('electron');
const { Menu, MenuItem } = remote;
//
module.exports.makeMenu = function (samples, callback)
{
    let menu = new Menu ();
    for (let sample of samples)
    {
        if ("string" in sample)
        {
            let menuItem = new MenuItem
            (
                {
                    label: sample.label.replace (/&/g, "&&"),
                    click: () => { callback (sample); }
                }
            );
            menu.append (menuItem);
        }
        else if ("items" in sample)
        {
            let items = sample.items;
            let subMenus = [ ];
            for (let item of items)
            {
                subMenus.push
                (
                    new MenuItem
                    (
                        {
                            label: item.label.replace (/&/g, "&&"),
                            click: () => { callback (item); }
                        }
                    )
                );
            }
            let menuItem = new MenuItem
            (
                {
                    label: sample.label.replace (/&/g, "&&"),
                    submenu: subMenus
                }
            );
            menu.append (menuItem);
        }
    }
    return menu;
}
//
