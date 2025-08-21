<template>
  <div class="footer-container">
    <div class="footer-content">
      <!-- 下一个纪念日倒计时 -->
      <div class="next-anniversary">
        <div class="anniversary-title">距离 {{ nextAnniversary.name }} 还有</div>
        <div class="countdown">
          <div class="countdown-item">
            <div class="count">{{ nextAnniversary.days }}</div>
            <div class="unit">天</div>
          </div>
          <div class="countdown-item">
            <div class="count">{{ nextAnniversary.hours }}</div>
            <div class="unit">时</div>
          </div>
          <div class="countdown-item">
            <div class="count">{{ nextAnniversary.minutes }}</div>
            <div class="unit">分</div>
          </div>
          <div class="countdown-item">
            <div class="count">{{ nextAnniversary.seconds }}</div>
            <div class="unit">秒</div>
          </div>
        </div>
      </div>

      <!-- 爱心波浪线 -->
      <div class="heart-divider">
        <span class="heart-icon" v-for="n in 5" :key="`heart-${n}`">❤</span>
      </div>

      <!-- 随机爱情语录 -->
      <div class="love-quote">{{ randomQuote }}</div>

      <!-- 版权信息 -->
      <div class="copyright">
        © {{ currentYear }} Hu & Tang | 用❤️创造每一天
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Lunar, Solar } from 'lunar-javascript';

// 改进的农历转公历函数
function getLunarDate(lunarMonth, lunarDay, year = new Date().getFullYear()) {
  try {
    // 检查当前农历日期是否已经过了，如果过了就用下一年的
    const now = new Date();
    const currentLunar = Lunar.fromDate(now);
    let targetYear = year;

    // 如果当前农历月份大于目标月份，或者月份相同但日期已过，则使用下一年
    if (currentLunar.getMonth() > lunarMonth ||
        (currentLunar.getMonth() === lunarMonth && currentLunar.getDay() > lunarDay)) {
      targetYear = year + 1;
    }

    // 农历转公历
    const lunar = Lunar.fromYmd(targetYear, lunarMonth, lunarDay);
    const solar = lunar.getSolar();
    console.log(`农历 ${targetYear}年${lunarMonth}月${lunarDay}日 转公历:`,
        new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay()));
    return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
  } catch (error) {
    console.error('农历转公历出错:', error, {lunarMonth, lunarDay, year});
    // 如果转换出错，返回一个默认日期
    return new Date(year, 0, 1);
  }
}

// 计算当前年份
const currentYear = new Date().getFullYear();

// 爱情语录数组
const loveQuotes = [
  "两个人的世界，因为有你而完整",
  "愿我们的爱情，如同星辰般永恒闪耀",
  "你是我最美的风景，最甜的牵挂",
  "执子之手，与子偕老",
  "愿时光能缓，愿故人不散",
  "你的笑容是我这辈子见过最美的风景",
  "我们的爱情故事，是我最喜欢的那一本",
  "感谢命运让我们相遇在最美的时光",
  "你是我最想要的未来和最美的现在",
  "愿岁月静好，现世安稳，有你相伴"
];

// 随机选择一条爱情语录
const randomQuote = ref('');

// 纪念日数据
const anniversaries = ref([]);
const nextAnniversary = ref({
  name: '',
  date: null,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

// 定时器
let timer = null;

// 初始化纪念日数据
function initAnniversaries() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;

  console.log('开始初始化纪念日数据，当前时间:', now);

  // 定义所有纪念日
  const allAnniversaries = [
    // 认识的日子
    {
      name: '认识纪念日',
      date: new Date(2025, 5, 6, 20, 0, 0) // 注意月份是从0开始的，6月是5
    },
    // 认识100天
    {
      name: '认识100天纪念日',
      getDate: () => {
        const startDate = new Date(2025, 5, 6, 20, 0, 0);
        const hundredDaysLater = new Date(startDate);
        hundredDaysLater.setDate(startDate.getDate() + 100);
        return hundredDaysLater;
      }
    },
    // 认识一年
    {
      name: '认识一周年',
      date: new Date(2026, 5, 6, 20, 0, 0)
    },
    // Hu的生日（农历2月初九）
    {
      name: 'Hu的生日',
      getDate: () => {
        const date = getLunarDate(2, 9);
        console.log('Hu的生日计算结果:', date);
        return date;
      }
    },
    // Tang的生日（农历9月12日）
    {
      name: 'Tang的生日',
      getDate: () => {
        const date = getLunarDate(9, 12);
        console.log('Tang的生日计算结果:', date);
        return date;
      }
    },
    // 情人节
    {
      name: '情人节',
      getDate: () => {
        const date = new Date(currentYear, 1, 14); // 2月14日
        return date < now ? new Date(nextYear, 1, 14) : date;
      }
    },
    // 七夕节（农历七月初七）
    {
      name: '七夕节',
      getDate: () => getLunarDate(7, 7)
    },
    // 圣诞节
    {
      name: '圣诞节',
      getDate: () => {
        const date = new Date(currentYear, 11, 25); // 12月25日
        return date < now ? new Date(nextYear, 11, 25) : date;
      }
    },
    // 春节（农历正月初一）- 法定节假日
    {
      name: '春节',
      getDate: () => getLunarDate(1, 1)
    },
    // 清明节（阳历4月4日或5日）- 法定节假日
    {
      name: '清明节',
      getDate: () => {
        const date = new Date(currentYear, 3, 5); // 4月5日
        return date < now ? new Date(nextYear, 3, 5) : date;
      }
    },
    // 劳动节 - 法定节假日
    {
      name: '劳动节',
      getDate: () => {
        const date = new Date(currentYear, 4, 1); // 5月1日
        return date < now ? new Date(nextYear, 4, 1) : date;
      }
    },
    // 端午节（农历五月初五）- 法定节假日
    {
      name: '端午节',
      getDate: () => getLunarDate(5, 5)
    },
    // 中秋节（农历八月十五）- 法定节假日
    {
      name: '中秋节',
      getDate: () => getLunarDate(8, 15)
    },
    // 国庆节 - 法定节假日
    {
      name: '国庆节',
      getDate: () => {
        const date = new Date(currentYear, 9, 1); // 10月1日
        return date < now ? new Date(nextYear, 9, 1) : date;
      }
    }
  ];

  // 处理所有纪念日，确保日期是正确的
  anniversaries.value = allAnniversaries.map(anni => {
    try {
      const annDate = anni.getDate ? anni.getDate() : anni.date;
      console.log(`处理纪念日: ${anni.name}, 日期:`, annDate);
      return {
        name: anni.name,
        date: annDate
      };
    } catch (error) {
      console.error(`处理纪念日出错: ${anni.name}`, error);
      return {
        name: anni.name,
        date: new Date(currentYear + 1, 0, 1) // 设置一个默认日期
      };
    }
  });

  console.log('初始化的所有纪念日:', anniversaries.value);
}

// 计算下一个纪念日
function calculateNextAnniversary() {
  const now = new Date();
  console.log('当前时间:', now);
  console.log('所有纪念日:', anniversaries.value);

  // 过滤出未来的纪念日
  const futureAnniversaries = anniversaries.value
      .filter(anni => anni.date && anni.date > now)
      .sort((a, b) => a.date - b.date);

  console.log('未来的纪念日:', futureAnniversaries);

  if (futureAnniversaries.length > 0) {
    const next = futureAnniversaries[0];
    const timeDiff = next.date - now;

    // 计算天、时、分、秒
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    nextAnniversary.value = {
      name: next.name,
      date: next.date,
      days,
      hours,
      minutes,
      seconds
    };

    console.log('下一个纪念日:', nextAnniversary.value);
  } else {
    console.warn('没有找到未来的纪念日，重新初始化');
    // 如果没有未来的纪念日，重新初始化
    initAnniversaries();

    // 再次尝试查找
    const retrySortedAnniversaries = anniversaries.value
        .filter(anni => anni.date && anni.date > now)
        .sort((a, b) => a.date - b.date);

    if (retrySortedAnniversaries.length > 0) {
      const next = retrySortedAnniversaries[0];
      const timeDiff = next.date - now;

      // 计算天、时、分、秒
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      nextAnniversary.value = {
        name: next.name,
        date: next.date,
        days,
        hours,
        minutes,
        seconds
      };
    } else {
      // 最后的备选方案
      nextAnniversary.value = {
        name: '下一个纪念日',
        date: new Date(now.getFullYear() + 1, 0, 1),
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }
  }
}

// 更新倒计时
function updateCountdown() {
  const now = new Date();

  // 如果没有下一个纪念日或者下一个纪念日已经过去，重新计算
  if (!nextAnniversary.value.date || nextAnniversary.value.date <= now) {
    calculateNextAnniversary();
    return;
  }

  const timeDiff = nextAnniversary.value.date - now;

  // 计算天、时、分、秒
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  nextAnniversary.value = {
    ...nextAnniversary.value,
    days,
    hours,
    minutes,
    seconds
  };

  // 如果倒计时结束，重新初始化
  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
    console.log('倒计时结束，重新初始化纪念日');
    initAnniversaries();
    calculateNextAnniversary();
  }
}

onMounted(() => {
  console.log('组件挂载，开始初始化');

  // 随机选择一条爱情语录
  const randomIndex = Math.floor(Math.random() * loveQuotes.length);
  randomQuote.value = loveQuotes[randomIndex];
  console.log('随机爱情语录:', randomQuote.value);

  // 检查 lunar-javascript 库是否正确加载
  console.log('Lunar 对象:', typeof Lunar, Lunar ? '已加载' : '未加载');
  console.log('Solar 对象:', typeof Solar, Solar ? '已加载' : '未加载');

  // 初始化纪念日数据
  initAnniversaries();
  console.log('纪念日初始化完成');

  // 计算下一个纪念日
  calculateNextAnniversary();
  console.log('下一个纪念日计算完成:', nextAnniversary.value);

  // 设置定时器，每秒更新倒计时
  timer = setInterval(updateCountdown, 1000);
  console.log('倒计时定时器已设置');
});

onUnmounted(() => {
  // 清除定时器
  if (timer) {
    clearInterval(timer);
    console.log('组件卸载，清除定时器');
  }
});
</script>

<style scoped>
.footer-container {
  width: 100%;
  padding: 30px 0;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
  border-top: 1px solid #eee;
}

.footer-content {
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
}

.next-anniversary {
  margin-bottom: 20px;
}

.anniversary-title {
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
  font-weight: 500;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.count {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 15px;
  min-width: 60px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.unit {
  font-size: 14px;
  color: #888;
  margin-top: 5px;
}

.heart-divider {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.heart-icon {
  color: #ff6b6b;
  font-size: 14px;
  margin: 0 8px;
  animation: heartbeat 1.5s infinite alternate;
}

.heart-icon:nth-child(odd) {
  animation-delay: 0.5s;
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.3);
  }
}

.love-quote {
  font-size: 16px;
  font-style: italic;
  color: #555;
  margin-bottom: 15px;
  line-height: 1.5;
}

.social-links {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.social-icon {
  margin: 0 10px;
  color: #666;
  font-size: 18px;
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-icon:hover {
  color: #ff6b6b;
  transform: scale(1.2);
}

.copyright {
  font-size: 14px;
  color: #888;
}

/* 适配暗色模式 */
@media (prefers-color-scheme: dark) {
  .footer-container {
    background-color: #222;
    border-top: 1px solid #333;
  }

  .anniversary-title {
    color: #ddd;
  }

  .count {
    background-color: #333;
    color: #ff8a8a;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  .unit {
    color: #aaa;
  }

  .love-quote {
    color: #bbb;
  }

  .social-icon {
    color: #aaa;
  }

  .copyright {
    color: #999;
  }
}

/* 响应式设计 */
@media (max-width: 600px) {
  .countdown {
    gap: 10px;
  }

  .count {
    font-size: 20px;
    padding: 8px 12px;
    min-width: 50px;
  }

  .unit {
    font-size: 12px;
  }

  .love-quote {
    font-size: 14px;
  }
}
</style>