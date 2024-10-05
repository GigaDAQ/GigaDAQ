import {app, BrowserWindow} from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.disableHardwareAcceleration();

//Create the main browser window
function createWindow(){
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // if you need to preload any scripts
            nodeIntegration: true,
        }
    });

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