import {
  HeadSetManager,
  WebHidSearcher,
  errors,
} from '../src/index';

const logEl = document.getElementById('log') as HTMLDivElement;
const deviceNameInput = document.getElementById('deviceName') as HTMLInputElement;
const btnConnect = document.getElementById('btnConnect') as HTMLButtonElement;
const btnDisconnect = document.getElementById('btnDisconnect') as HTMLButtonElement;
const btnMute = document.getElementById('btnMute') as HTMLButtonElement;
const btnUnmute = document.getElementById('btnUnmute') as HTMLButtonElement;
const btnAnswer = document.getElementById('btnAnswer') as HTMLButtonElement;
const btnReject = document.getElementById('btnReject') as HTMLButtonElement;
const btnCapabilities = document.getElementById('btnCapabilities') as HTMLButtonElement;

const appendLog = (message: string, type: 'info' | 'event' | 'error' = 'info') => {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
};

const setConnected = (connected: boolean) => {
  btnConnect.disabled = connected;
  btnDisconnect.disabled = !connected;
  btnMute.disabled = !connected;
  btnUnmute.disabled = !connected;
  btnAnswer.disabled = !connected;
  btnReject.disabled = !connected;
  btnCapabilities.disabled = !connected;
};

const searcher = new WebHidSearcher();
const manager = new HeadSetManager(searcher);

manager.on('inputreport', (payload: unknown) => {
  appendLog(`Event: inputreport ${JSON.stringify(payload)}`, 'event');
});
manager.on('muted-mic', () => appendLog('Event: muted-mic', 'event'));
manager.on('unmuted-mic', () => appendLog('Event: unmuted-mic', 'event'));
manager.on('incoming-call', () => appendLog('Event: incoming-call', 'event'));
manager.on('call-answered', () => appendLog('Event: call-answered', 'event'));
manager.on('call-rejected', () => appendLog('Event: call-rejected', 'event'));

btnConnect.addEventListener('click', async () => {
  const name = deviceNameInput.value.trim();
  if (!name) {
    appendLog('Enter device name', 'error');
    return;
  }
  try {
    appendLog(`Connecting to device: ${name}`);
    await manager.connect(name);
    appendLog('Connected');
    setConnected(true);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    appendLog(`Connect failed: ${message}`, 'error');
    if (errors.hasDeviceNotFoundError(e)) {
      appendLog('Tip: Request device access first (e.g. via requestDevice in console)', 'info');
    }
  }
});

btnDisconnect.addEventListener('click', async () => {
  await manager.disconnect();
  appendLog('Disconnected');
  setConnected(false);
});

btnMute.addEventListener('click', async () => {
  try {
    await manager.send(new Uint8Array([0x01]));
    appendLog('Sent: Mute');
  } catch (e) {
    appendLog(`Send failed: ${e instanceof Error ? e.message : String(e)}`, 'error');
  }
});

btnUnmute.addEventListener('click', async () => {
  try {
    await manager.send(new Uint8Array([0x02]));
    appendLog('Sent: Unmute');
  } catch (e) {
    appendLog(`Send failed: ${e instanceof Error ? e.message : String(e)}`, 'error');
  }
});

btnAnswer.addEventListener('click', async () => {
  try {
    await manager.send(new Uint8Array([0x03]));
    appendLog('Sent: Answer');
  } catch (e) {
    appendLog(`Send failed: ${e instanceof Error ? e.message : String(e)}`, 'error');
  }
});

btnReject.addEventListener('click', async () => {
  try {
    await manager.send(new Uint8Array([0x04]));
    appendLog('Sent: Reject');
  } catch (e) {
    appendLog(`Send failed: ${e instanceof Error ? e.message : String(e)}`, 'error');
  }
});

btnCapabilities.addEventListener('click', () => {
  const caps = manager.getCapabilities();
  appendLog(`Capabilities: ${JSON.stringify(caps)}`);
});

appendLog('Demo loaded. Enter device name and click Find and Connect.');
