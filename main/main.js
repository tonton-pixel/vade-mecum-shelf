//
const electron = require ('electron');
const { app, BrowserWindow, dialog, globalShortcut, ipcMain, Menu, shell } = electron;
//
let mainWindow = null;
//
const isAlreadyRunning = app.makeSingleInstance
(
    () =>
    {
        if (mainWindow)
        {
            if (mainWindow.isMinimized ())
            {
                mainWindow.restore ();
            }
            mainWindow.show ();
        }
    }
);
if (isAlreadyRunning)
{
    app.quit ();
}
else
{
    // Share settings with the renderer process
    global.settings = require ('./settings.json');
    //
    if (!settings.accelerated)
    {
        app.disableHardwareAcceleration ();
    }
    //
    const fs = require ('fs');
    const path = require ('path');
    const url = require ('url');
    //
    const packagedApp = !process.defaultApp;
    //
    const appName = app.getName ();
    const appVersion = app.getVersion ();
    const appDate = (packagedApp ? fs.statSync (app.getPath ('exe')).birthtime : new Date ()).toISOString ();
    //
    let appDirname = app.getAppPath ();
    let unpackedDirname = `${appDirname}.unpacked`;
    if (!fs.existsSync (unpackedDirname))
    {
        unpackedDirname = appDirname;
    };
    //
    let aboutBoxDisplayed = false;
    //
    function showAboutBox (menuItem, browserWindow, event)
    {
        if (!aboutBoxDisplayed)
        {
            let options =
            {
                type: 'info',
                title: `About ${appName}`,
                message: `${appName}`,
                detail: `${settings.description}\n${settings.copyright}\n\nVersion: ${appVersion}\nDate: ${appDate}`,
                buttons: [ "OK" ]
            };
            aboutBoxDisplayed = true;
            dialog.showMessageBox ((process.platform === 'darwin') ? null : browserWindow, options);
            aboutBoxDisplayed = false;
        }
    }
    //
    let defaultWidth;
    let defaultHeight;
    //
    function resetWindow ()
    {
        if (mainWindow.isFullScreen ())
        {
            shell.beep ();
        }
        else
        {
            if (mainWindow.isMaximized ())
            {
                mainWindow.unmaximize ();
            }
            mainWindow.setSize (defaultWidth, defaultHeight);
            mainWindow.center ();
            if (mainWindow.isMinimized ())
            {
                mainWindow.restore ();
            }
        }
    }
    //
    const darwinAppMenu =
    {
        submenu:
        [
            { label: `About ${appName}...`, click: showAboutBox },
            { type: 'separator' },
            { role: 'services', submenu: [ ] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    };
    const appMenu =
    {
        label: settings.shortAppName,
        submenu:
        [
            { role: 'quit' }
        ]
    };
    const editMenu =
    {
        label: "Edit",
        submenu:
        [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectall' }
        ]
    };
    const viewMenu =
    {
        label: "View",
        submenu:
        [
            { label: "Toggle Navigation Sidebar", accelerator: 'CommandOrControl+N', click: () => { mainWindow.webContents.send ('toggle-sidebar'); } },
            { label: "Toggle Categories", accelerator: 'CommandOrControl+K', click: () => { mainWindow.webContents.send ('toggle-categories'); } },
            { type: 'separator' },
            { label: "Scroll to Top", accelerator: 'CommandOrControl+T', click: () => { mainWindow.webContents.send ('scroll-to-top'); } },
            { label: "Scroll to Bottom", accelerator: 'CommandOrControl+B', click: () => { mainWindow.webContents.send ('scroll-to-bottom'); } },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    };
    const developerMenu =
    {
        label: "Developer",
        submenu:
        [
            { role: 'reload' },
            // { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            // { label: "Open User Data Directory", click: () => { shell.openItem (app.getPath ('userData')); } },
            { label: "Open User Data Directory", click: () => { shell.openExternal (url.format ({ protocol: 'file:', pathname: app.getPath ('userData') })); } },
            // { label: "Open Temporary Directory", click: () => { shell.openItem (app.getPath ('temp')); } }
            { label: "Open Temporary Directory", click: () => { shell.openExternal (url.format ({ protocol: 'file:', pathname: app.getPath ('temp') })); } },
            { type: 'separator' },
            { label: "Show Executable File", click: () => { shell.showItemInFolder (app.getPath ('exe')); } }
        ]
    };
    const darwinWindowMenu =
    {
        role: 'window',
        submenu:
        [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { label: "Reset to Default", accelerator: 'CommandOrControl+D', click: () => { resetWindow (); } },
            { type: 'separator' },
            { role: 'front' }
        ]
    };
    const windowMenu =
    {
        label: "Window",
        submenu:
        [
            { role: 'minimize' },
            { role: 'close' },
            { type: 'separator' },
            { label: "Reset to Default", accelerator: 'CommandOrControl+D', click: () => { resetWindow (); } }
         ]
    };
    const darwinHelpMenu =
    {
        role: 'help',
        submenu:
        [
            { label: "License", click: () => { shell.openItem (path.join (unpackedDirname, 'LICENSE.txt')); } },
            { label: settings.homePage.label, click: () => { shell.openExternal (settings.homePage.URL); } }
        ]
    };
    const helpMenu =
    {
        label: 'Help',
        submenu:
        [
            { label: "About...", click: showAboutBox },
            { type: 'separator' },
            { label: "License", click: () => { shell.openItem (path.join (unpackedDirname, 'LICENSE.txt')); } },
            { label: settings.homePage.label, click: () => { shell.openExternal (settings.homePage.URL); } }
        ]
    };
    //
    let menuTemplate = [ ];
    menuTemplate.push ((process.platform === 'darwin') ? darwinAppMenu : appMenu);
    menuTemplate.push (editMenu);
    menuTemplate.push (viewMenu);
    if (settings.unitsMenu)
    {
        menuTemplate.push ({ label: settings.unitsName.replace (/&/g, "&&"), submenu: [ ] });
    }
    if (settings.developerMenu)
    {
        menuTemplate.push (developerMenu);
    }
    menuTemplate.push ((process.platform === 'darwin') ? darwinWindowMenu : windowMenu);
    menuTemplate.push ((process.platform === 'darwin') ? darwinHelpMenu : helpMenu);
    //
    let menu;
    //
    function updateUnitsMenu (unitNames, currentUnitName)
    {
        for (let menuTemplateItem of menuTemplate)
        {
            if (menuTemplateItem["label"] === settings.unitsName.replace (/&/g, "&&"))
            {
                menuTemplateItem["submenu"] = [ ];
                for (let unitName of unitNames)
                {
                    menuTemplateItem["submenu"].push
                    (
                        {
                            label: unitName.replace (/&/g, "&&"),
                            type: 'radio',
                            checked: (unitName === currentUnitName),
                            click: () => { mainWindow.webContents.send ('select-unit', unitName); },
                        } 
                    );
                }
                menu = Menu.buildFromTemplate (menuTemplate);
                Menu.setApplicationMenu (menu);
                break;
            }
        }
    }
    //
    function syncUnitsMenu (unitName)
    {
        for (let menuItem of menu.items)
        {
            if (menuItem.label === settings.unitsName.replace (/&/g, "&&"))
            {
                let submenu = menuItem.submenu;
                for (let submenuItem of submenu.items)
                {
                    if (submenuItem.label === unitName.replace (/&/g, "&&"))
                    {
                        submenuItem.checked = true;
                    }
                }
            }
        }
    }
    //
    function onAppReady ()
    {
        if (!settings.unitsMenu)
        {
            menu = Menu.buildFromTemplate (menuTemplate);
            Menu.setApplicationMenu (menu);
        }
        //
        const Storage = require ('../lib/storage.js');
        const mainStorage = new Storage ('main-preferences');
        //
        const { screen } = electron;
        let workAreaWidth = screen.getPrimaryDisplay ().workArea.width;
        let workAreaHeight = screen.getPrimaryDisplay ().workArea.height;
        //
        defaultWidth = settings.window.largerDefaultWidth;
        defaultHeight = settings.window.largerDefaultHeight;
        if ((defaultWidth > workAreaWidth) || (defaultHeight > workAreaHeight))
        {
            defaultWidth = settings.window.defaultWidth;
            defaultHeight = settings.window.defaultHeight;
        }
        //
        const defaultPrefs =
        {
            windowBounds:
            {
                width: defaultWidth,
                height: defaultHeight
            }
        };
        let prefs = mainStorage.get (defaultPrefs);
        let windowBounds = prefs.windowBounds;
        //
        mainWindow = new BrowserWindow
        (
            {
                icon: (process.platform === 'linux') && path.join (__dirname, '..', 'icons', 'icon-256.png'),
                center: true,
                x: windowBounds.x,
                y: windowBounds.y,
                width: windowBounds.width,
                height: windowBounds.height,
                minWidth: settings.window.minWidth,
                minHeight: settings.window.minHeight,
                backgroundColor: settings.window.backgroundColor,
                show: !settings.window.deferredShow
            }
        );
        //
        mainWindow.loadURL (url.format ({ protocol: 'file', slashes: true, pathname: path.join (__dirname, '..', 'renderer', 'index.html') }));
        //
        mainWindow.webContents.on ('will-navigate', (event) => { event.preventDefault (); }); // Inhibit drag-and-drop of URL on window
        //
        mainWindow.once ('close', () => { mainStorage.set ({ windowBounds: mainWindow.getBounds () }); });
        //
        mainWindow.once ('closed', () => { if (process.platform === 'darwin') { app.hide (); } app.quit (); });
        //
        if (settings.unitsMenu)
        {
            ipcMain.on
            (
                'update-units-menu',
                (event, unitNames, currentUnitName) =>
                {
                    updateUnitsMenu (unitNames, currentUnitName);
                }
            );
            ipcMain.on ('sync-units-menu', (event, unitName) => { syncUnitsMenu (unitName); });
        }
        //
        ipcMain.on ('show-window', () => { mainWindow.show (); });
        //
        if (settings.hotKey)
        {
            // Set hot key
            globalShortcut.register (settings.hotKey, () => { mainWindow.show (); });
        }
    }
    //
    app.once ('ready', onAppReady);
}
//
