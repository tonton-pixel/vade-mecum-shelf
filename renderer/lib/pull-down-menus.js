//
const { webFrame } = require ('electron');
//
module.exports.popup = function (buttonRect, menu)
{
    let factor = webFrame.getZoomFactor ();
    let x = (buttonRect.left * factor) + ((process.platform === 'darwin') ? 0 : 0);  // !!
    let y = (buttonRect.bottom  * factor) + ((process.platform === 'darwin') ? 4 : 2);  // !!
    menu.popup ({ x: Math.round (x), y: Math.round (y) });
}
//
