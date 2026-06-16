const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化历史记录文件
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'src', 'icon.png'),
    title: '双色球随机抽号',
    backgroundColor: '#f5f5f5'
  });

  mainWindow.loadFile('src/index.html');

  // 开发模式下打开开发者工具
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC 通信：读取历史记录
ipcMain.handle('load-history', async () => {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
});

// IPC 通信：保存历史记录
ipcMain.handle('save-history', async (event, records) => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(records, null, 2));
    return true;
  } catch (error) {
    console.error('保存历史记录失败:', error);
    return false;
  }
});

// IPC 通信：清空历史记录
ipcMain.handle('clear-history', async () => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
    return true;
  } catch (error) {
    console.error('清空历史记录失败:', error);
    return false;
  }
});
