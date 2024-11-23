import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
    sendToA: function(){
        ipcRenderer.send("A");
    },
    receiveFromD: function(func){
        ipcRenderer.on("D", (event, ...args) => func(event, ...args));
    }
});