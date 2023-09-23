const { app, BrowserWindow, Menu, ipcMain, shell, } = require('electron');
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
let mainWindow;
// Date

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});
// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: 'FileMenu',
    submenu: [
      {       
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
            click() {
              app.quit();
            }
          }
    ]
  },
  ...(!isMac
    ? [
        {
          label: 'About',
          click: createAboutWindow,
        },
      ]
    : []),
];