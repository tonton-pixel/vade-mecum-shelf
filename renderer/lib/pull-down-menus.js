//
const { webFrame } = require ('electron');
//
module.exports.popup = function (button, menu)
{
    let buttonRect = button.getBoundingClientRect ();
    let factor = webFrame.getZoomFactor ();
    let x = (buttonRect.left * factor) + ((process.platform === 'darwin') ? -1 : 0);  // !!
    let y = (buttonRect.bottom  * factor) + ((process.platform === 'darwin') ? 4 : 2);  // !!
    button.classList.add ('open');
    menu.popup ({ x: Math.round (x), y: Math.round (y), callback: () => { button.classList.remove ('open'); } });
}
//
