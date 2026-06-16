/**
 * 渲染进程 - 双色球随机抽号器
 */

// 全局状态
let historyRecords = [];

// DOM 元素
const elements = {
  // 标签页
  tabs: document.querySelectorAll('.tab'),
  tabContents: document.querySelectorAll('.tab-content'),

  // 摇号页面
  countInput: document.getElementById('count'),
  generateBtn: document.getElementById('generateBtn'),
  singleResult: document.getElementById('singleResult'),
  redBalls: document.getElementById('redBalls'),
  blueBall: document.getElementById('blueBall'),
  batchResult: document.getElementById('batchResult'),
  batchList: document.getElementById('batchList'),

  // 历史记录页面
  historyList: document.getElementById('historyList'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),

  // 统计页面
  redChart: document.getElementById('redChart'),
  blueChart: document.getElementById('blueChart')
};

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await loadHistory();
  setupEventListeners();
});

// 设置事件监听
function setupEventListeners() {
  // 标签页切换
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // 生成按钮
  elements.generateBtn.addEventListener('click', generateLottery);

  // 清空历史
  elements.clearHistoryBtn.addEventListener('click', clearHistory);
}

// 切换标签页
function switchTab(tabName) {
  // 更新标签状态
  elements.tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // 更新内容显示
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabName);
  });

  // 切换到统计页面时更新图表
  if (tabName === 'stats') {
    updateStatsChart();
  }

  // 切换到历史页面时更新列表
  if (tabName === 'history') {
    renderHistoryList();
  }
}

// 生成双色球号码
function generateLottery() {
  const count = parseInt(elements.countInput.value) || 1;

  if (count < 1 || count > 100) {
    alert('请输入 1-100 之间的数字');
    return;
  }

  const results = Lottery.generateBatch(count);

  // 保存到历史记录
  const timestamp = new Date().toLocaleString('zh-CN');
  results.forEach(result => {
    historyRecords.push({
      timestamp,
      ...result
    });
  });

  // 保存到文件
  saveHistory();

  // 显示结果
  if (count === 1) {
    showSingleResult(results[0]);
  } else {
    showBatchResult(results);
  }
}

// 显示单注结果
function showSingleResult(result) {
  elements.singleResult.style.display = 'block';
  elements.batchResult.style.display = 'none';

  // 清空并生成红球
  elements.redBalls.innerHTML = '';
  result.red.forEach((num, index) => {
    const ball = document.createElement('div');
    ball.className = 'ball red';
    ball.textContent = String(num).padStart(2, '0');
    ball.style.animationDelay = `${index * 0.1}s`;
    elements.redBalls.appendChild(ball);
  });

  // 生成蓝球
  elements.blueBall.innerHTML = '';
  const blueBall = document.createElement('div');
  blueBall.className = 'ball blue';
  blueBall.textContent = String(result.blue).padStart(2, '0');
  blueBall.style.animationDelay = '0.6s';
  elements.blueBall.appendChild(blueBall);
}

// 显示批量结果
function showBatchResult(results) {
  elements.singleResult.style.display = 'none';
  elements.batchResult.style.display = 'block';

  elements.batchList.innerHTML = '';
  results.forEach((result, index) => {
    const item = document.createElement('div');
    item.className = 'batch-item';

    const number = document.createElement('span');
    number.className = 'batch-number';
    number.textContent = `#${index + 1}`;

    const balls = document.createElement('div');
    balls.className = 'batch-balls';

    // 红球
    result.red.forEach(num => {
      const ball = document.createElement('span');
      ball.className = 'mini-ball red';
      ball.textContent = String(num).padStart(2, '0');
      balls.appendChild(ball);
    });

    // 蓝球
    const blue = document.createElement('span');
    blue.className = 'mini-ball blue';
    blue.textContent = String(result.blue).padStart(2, '0');
    balls.appendChild(blue);

    item.appendChild(number);
    item.appendChild(balls);
    elements.batchList.appendChild(item);
  });
}

// 加载历史记录
async function loadHistory() {
  try {
    if (window.electronAPI) {
      historyRecords = await window.electronAPI.loadHistory() || [];
    }
  } catch (error) {
    console.error('加载历史记录失败:', error);
    historyRecords = [];
  }
}

// 保存历史记录
async function saveHistory() {
  try {
    if (window.electronAPI) {
      await window.electronAPI.saveHistory(historyRecords);
    }
  } catch (error) {
    console.error('保存历史记录失败:', error);
  }
}

// 渲染历史记录列表
function renderHistoryList() {
  elements.historyList.innerHTML = '';

  if (historyRecords.length === 0) {
    elements.historyList.innerHTML = '<div class="empty-message">暂无历史记录</div>';
    return;
  }

  // 倒序显示，最新的在前面
  const reversedRecords = [...historyRecords].reverse();

  reversedRecords.forEach((record, index) => {
    const item = document.createElement('div');
    item.className = 'history-item';

    const time = document.createElement('span');
    time.className = 'history-time';
    time.textContent = record.timestamp;

    const balls = document.createElement('div');
    balls.className = 'history-balls';

    // 红球
    record.red.forEach(num => {
      const ball = document.createElement('span');
      ball.className = 'mini-ball red';
      ball.textContent = String(num).padStart(2, '0');
      balls.appendChild(ball);
    });

    // 蓝球
    const blue = document.createElement('span');
    blue.className = 'mini-ball blue';
    blue.textContent = String(record.blue).padStart(2, '0');
    balls.appendChild(blue);

    item.appendChild(time);
    item.appendChild(balls);
    elements.historyList.appendChild(item);
  });
}

// 清空历史记录
async function clearHistory() {
  if (confirm('确定要清空所有历史记录吗？')) {
    historyRecords = [];
    await saveHistory();
    renderHistoryList();
    updateStatsChart();
  }
}

// 更新统计图表
function updateStatsChart() {
  const { redStats, blueStats } = Lottery.calculateStats(historyRecords);

  // 找到最大值用于计算柱状图高度
  const maxRedCount = Math.max(...Array.from(redStats.values()), 1);
  const maxBlueCount = Math.max(...Array.from(blueStats.values()), 1);

  // 绘制红球统计
  elements.redChart.innerHTML = '';
  for (let i = Lottery.RED_MIN; i <= Lottery.RED_MAX; i++) {
    const count = redStats.get(i) || 0;
    const height = Math.max(5, (count / maxRedCount) * 100);

    const barContainer = document.createElement('div');
    barContainer.className = 'chart-bar';

    const value = document.createElement('span');
    value.className = 'bar-value';
    value.textContent = count;

    const bar = document.createElement('div');
    bar.className = 'bar red';
    bar.style.height = `${height}px`;

    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = String(i).padStart(2, '0');

    barContainer.appendChild(value);
    barContainer.appendChild(bar);
    barContainer.appendChild(label);
    elements.redChart.appendChild(barContainer);
  }

  // 绘制蓝球统计
  elements.blueChart.innerHTML = '';
  for (let i = Lottery.BLUE_MIN; i <= Lottery.BLUE_MAX; i++) {
    const count = blueStats.get(i) || 0;
    const height = Math.max(5, (count / maxBlueCount) * 100);

    const barContainer = document.createElement('div');
    barContainer.className = 'chart-bar';

    const value = document.createElement('span');
    value.className = 'bar-value';
    value.textContent = count;

    const bar = document.createElement('div');
    bar.className = 'bar blue';
    bar.style.height = `${height}px`;

    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = String(i).padStart(2, '0');

    barContainer.appendChild(value);
    barContainer.appendChild(bar);
    barContainer.appendChild(label);
    elements.blueChart.appendChild(barContainer);
  }
}
