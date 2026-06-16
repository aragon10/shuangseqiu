/**
 * 双色球随机抽号核心逻辑
 * 规则：红球 1-33 选 6 个（不重复），蓝球 1-16 选 1 个
 */

const Lottery = {
  // 红球范围
  RED_MIN: 1,
  RED_MAX: 33,
  RED_COUNT: 6,

  // 蓝球范围
  BLUE_MIN: 1,
  BLUE_MAX: 16,

  /**
   * 生成指定范围内的随机整数
   */
  getRandomInt(min, max) {
    const range = max - min + 1;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % range);
  },

  /**
   * 生成一注双色球号码
   * @returns {{ red: number[], blue: number }}
   */
  generateSingle() {
    const redBalls = new Set();

    // 生成 6 个不重复的红球
    while (redBalls.size < this.RED_COUNT) {
      redBalls.add(this.getRandomInt(this.RED_MIN, this.RED_MAX));
    }

    // 红球排序
    const red = Array.from(redBalls).sort((a, b) => a - b);

    // 生成蓝球
    const blue = this.getRandomInt(this.BLUE_MIN, this.BLUE_MAX);

    return { red, blue };
  },

  /**
   * 批量生成双色球号码
   * @param {number} count - 生成注数
   * @returns {Array<{ red: number[], blue: number }>}
   */
  generateBatch(count) {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(this.generateSingle());
    }
    return results;
  },

  /**
   * 格式化号码为字符串
   * @param {{ red: number[], blue: number }} lottery
   * @returns {string}
   */
  format(lottery) {
    const redStr = lottery.red.map(n => String(n).padStart(2, '0')).join(' ');
    const blueStr = String(lottery.blue).padStart(2, '0');
    return `红球: ${redStr} | 蓝球: ${blueStr}`;
  },

  /**
   * 计算号码统计
   * @param {Array<{ red: number[], blue: number }>} records
   * @returns {{ redStats: Map<number, number>, blueStats: Map<number, number> }}
   */
  calculateStats(records) {
    const redStats = new Map();
    const blueStats = new Map();

    // 初始化统计
    for (let i = this.RED_MIN; i <= this.RED_MAX; i++) {
      redStats.set(i, 0);
    }
    for (let i = this.BLUE_MIN; i <= this.BLUE_MAX; i++) {
      blueStats.set(i, 0);
    }

    // 统计出现次数
    records.forEach(record => {
      record.red.forEach(num => {
        redStats.set(num, (redStats.get(num) || 0) + 1);
      });
      blueStats.set(record.blue, (blueStats.get(record.blue) || 0) + 1);
    });

    return { redStats, blueStats };
  }
};

// 导出（在 Electron 渲染进程中通过 script 标签引入）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Lottery;
}
