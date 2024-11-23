import {app, BrowserWindow} from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.disableHardwareAcceleration();

//Keep a global ref of the window object, if you don't , the window will 
//be closed automatically when the JavaScript object is garbage collected
let win;

//Create the main browser window
async function createWindow(){
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // if you need to preload any scripts
            nodeIntegration: false,
            contextIsolation: true, // cannot be chaged by any renderer process, makes our app more secure
            sandbox: true,
        }
    });

    // Event listeners on the window
    win.webContents.on("did-finish-load", () =>{
        win.show();
        win.focus();
    })

    win.loadURL('http://localhost:5173');
}


app.whenReady().then(() =>{
    createWindow();

    app.on('activate', () =>{
        if (BrowserWindow.getAllWindows().length === 0 ) createWindow();
    });
});


app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin') app.quit();
});