const path = require('path');
const os = require('os');
const fs = require('fs');
const sharp = require('sharp');
const { app, BrowserWindow, Menu, ipcMain, shell, } = require('electron');
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
let mainWindow;
let aboutWindow;
let uploadWindow;
// Date
let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
// firebase

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 700 : 500,
    height: 610,
    icon: `${__dirname}/assets/icons/icon.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile(path.join(__dirname, './renderer/login.html'));
  mainWindow.on('closed', function() {
     app.quit();
  })
}
// Upload
function createUploadWindow() {
  uploadWindow = new BrowserWindow({
    width: 600,
    height: 600,
    title: 'Upload Photo',
    icon: `${__dirname}/assets/icons/icon.png`,
  });

   uploadWindow.loadFile(path.join(__dirname, './renderer/upload.html'));
}
// About Window
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    autoHideMenuBar: true,
    title: 'About Image Resizer',
    icon: `${__dirname}/assets/icons/icon.png`,
  });

   aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}
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
        label: 'Upload',
        click() {
          mainWindow.loadFile('./renderer/upload.html');
        }
      },
      {
        label: 'Logout',
        click() {
          mainWindow.loadFile('./renderer/login.html');
        }
      },
      {type: 'separator'},
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
// Respond to the resize image
ipcMain.on('image:resize', (e, options) => {
  options.dest = path.join(os.homedir(), 'imageresizer');
  resizeImage(options);
});
// upload
ipcMain.on('image:resize', (e, options) => {
  options.dest = path.join(__dirname, './renderer/upload.html');
  resizeImage(options);
});
// Resize and save image
async function resizeImage({ imgPath, height, width, dest }) {
  try {
    const startTime = new Date();
    // Resize image
   /* const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    });*/
    
    // Sharp
    const newPath = await sharp(imgPath)
      .resize({ width: +width, height: +height })
      .toBuffer();   
    // Get filename
    const filename = path.basename(imgPath);
    // Create destination folder if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    // Write the file to the destination folder
    fs.writeFileSync(path.join(dest, filename), newPath);
    // Send success to renderer
    mainWindow.webContents.send('image:done');
    // Open the folder in the file explorer
    shell.openPath(dest);
    console.log('Time completed in ms: ', ((new Date()).getTime() - startTime.getTime()));
    console.log('Date completed:',   month + "-" + date + "-" + year);
  } catch (err) {
    console.log(err);
  }
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});
// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});