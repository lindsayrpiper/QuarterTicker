import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('quarterAPI', {
  getConfig: (): Promise<{ q1StartMonth: number | null }> =>
    ipcRenderer.invoke('config:get'),
  setConfig: (month: number): Promise<{ q1StartMonth: number }> =>
    ipcRenderer.invoke('config:set', month),
});
