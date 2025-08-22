<template>
  <div class="footer-container">
    <div class="footer-content">
      <!-- 天气卡片 -->
      <div class="card weather-card">
        <div class="card-header">
          <h3>今日天气</h3>
        </div>
        <div class="weather-header">
          <div class="weather-location">苏州市</div>
          <div class="weather-time">{{ weatherTime }}</div>
        </div>
        <div class="weather-content">
          <div class="weather-icon">
            <img :src="getWeatherIcon(weatherData.skycon)" alt="天气图标">
          </div>
          <div class="weather-info">
            <div class="weather-temp">{{ weatherData.temperature }}°C</div>
            <div class="weather-desc">{{ getWeatherDesc(weatherData.skycon) }}</div>
          </div>
        </div>
        <div class="weather-details">
          <div class="weather-detail-item">
            <span class="detail-label">湿度</span>
            <span class="detail-value">{{ (weatherData.humidity * 100).toFixed(0) }}%</span>
          </div>
          <div class="weather-detail-item">
            <span class="detail-label">风速</span>
            <span class="detail-value">{{ weatherData.wind.speed }}km/h</span>
          </div>
          <div class="weather-detail-item">
            <span class="detail-label">空气质量</span>
            <span class="detail-value">{{ weatherData.aqi }}</span>
          </div>
        </div>
        <div class="weather-forecast">
          {{ weatherData.forecast }}
        </div>
      </div>

      <!-- 下一个纪念日倒计时 -->
      <div class="card anniversary-card">
        <div class="card-header">
          <h3>纪念日倒计时</h3>
        </div>
        <div class="anniversary-title">距离 {{ nextAnniversary.name }} 还有</div>
        <div class="countdown">
          <div class="countdown-item">
            <div class="count-container">
              <div class="count">{{ nextAnniversary.days }}</div>
              <div class="unit">天</div>
            </div>
          </div>
          <div class="countdown-item">
            <div class="count-container">
              <div class="count">{{ nextAnniversary.hours }}</div>
              <div class="unit">时</div>
            </div>
          </div>
          <div class="countdown-item">
            <div class="count-container">
              <div class="count">{{ nextAnniversary.minutes }}</div>
              <div class="unit">分</div>
            </div>
          </div>
          <div class="countdown-item">
            <div class="count-container">
              <div class="count">{{ nextAnniversary.seconds }}</div>
              <div class="unit">秒</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 随机爱情语录 -->
      <div class="card quote-card">
        <div class="card-header">
          <h3>爱情语录</h3>
        </div>
        <div class="love-quote">{{ randomQuote }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Lunar, Solar } from 'lunar-javascript';
import axios from 'axios';

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

// 天气数据
const weatherData = ref({
  temperature: '--',
  humidity: 0,
  skycon: 'CLEAR_DAY',
  wind: { speed: 0, direction: 0 },
  aqi: '--',
  forecast: '暂无天气预报'
});
const weatherTime = ref('--:--');

// 定时器
let timer = null;
let weatherTimer = null;

// 初始化纪念日数据
function initAnniversaries() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;


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
      return {
        name: anni.name,
        date: annDate
      };
    } catch (error) {
      return {
        name: anni.name,
        date: new Date(currentYear + 1, 0, 1) // 设置一个默认日期
      };
    }
  });

}

// 计算下一个纪念日
function calculateNextAnniversary() {
  const now = new Date();

  // 过滤出未来的纪念日
  const futureAnniversaries = anniversaries.value
      .filter(anni => anni.date && anni.date > now)
      .sort((a, b) => a.date - b.date);


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

  } else {
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
    initAnniversaries();
    calculateNextAnniversary();
  }
}

// 获取天气数据
async function fetchWeatherData() {
  try {
    // 苏州的经纬度：31.3000, 120.5800
    // 使用代理服务器或JSONP方式解决跨域问题
    const response = await axios.get('https://api.caiyunapp.com/v2.6/eyvn0HDeToa45QA3/120.5800,31.3000/hourly?hourlysteps=1', {
      // 添加跨域请求头
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('天气API响应:', response.data);

    if (response.data && response.data.status === 'ok') {
      const result = response.data.result;
      const hourly = result.hourly;

      if (hourly && hourly.status === 'ok') {
        // 更新天气数据
        weatherData.value = {
          temperature: hourly.temperature[0].value,
          humidity: hourly.humidity[0].value,
          skycon: hourly.skycon[0].value,
          wind: {
            speed: hourly.wind[0].speed,
            direction: hourly.wind[0].direction
          },
          aqi: hourly.air_quality.aqi[0].value.chn,
          forecast: hourly.description
        };

        // 更新天气时间
        const dateTime = new Date(hourly.skycon[0].datetime);
        weatherTime.value = `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;
      }
    } else {
      // 如果API请求成功但没有返回预期数据，设置默认值
      setDefaultWeatherData();
    }
  } catch (error) {
    console.error('获取天气数据失败:', error);
    // 设置默认天气数据
    setDefaultWeatherData();
  }
}

// 设置默认天气数据（当API请求失败时）
function setDefaultWeatherData() {
  const now = new Date();
  weatherData.value = {
    temperature: 25,
    humidity: 0.6,
    skycon: 'CLEAR_DAY',
    wind: {
      speed: 5,
      direction: 90
    },
    aqi: 50,
    forecast: '今日天气晴朗'
  };
  weatherTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// 获取天气图标
function getWeatherIcon(skycon) {
  const iconMap = {
    'CLEAR_DAY': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/clear-day.svg',
    'CLEAR_NIGHT': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/clear-night.svg',
    'PARTLY_CLOUDY_DAY': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/partly-cloudy-day.svg',
    'PARTLY_CLOUDY_NIGHT': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/partly-cloudy-night.svg',
    'CLOUDY': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/cloudy.svg',
    'LIGHT_HAZE': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/haze.svg',
    'MODERATE_HAZE': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/haze.svg',
    'HEAVY_HAZE': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/haze.svg',
    'LIGHT_RAIN': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/rain.svg',
    'MODERATE_RAIN': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/rain.svg',
    'HEAVY_RAIN': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/rain.svg',
    'STORM_RAIN': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/thunderstorm.svg',
    'FOG': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/fog.svg',
    'LIGHT_SNOW': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/snow.svg',
    'MODERATE_SNOW': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/snow.svg',
    'HEAVY_SNOW': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/snow.svg',
    'STORM_SNOW': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/snow.svg',
    'DUST': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/dust.svg',
    'SAND': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/dust.svg',
    'WIND': 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/wind.svg',
  };

  return iconMap[skycon] || 'https://cdn.jsdelivr.net/gh/chukai/weather-icon/icon/cloudy.svg';
}

// 获取天气描述
function getWeatherDesc(skycon) {
  const descMap = {
    'CLEAR_DAY': '晴天',
    'CLEAR_NIGHT': '晴夜',
    'PARTLY_CLOUDY_DAY': '多云',
    'PARTLY_CLOUDY_NIGHT': '多云',
    'CLOUDY': '阴',
    'LIGHT_HAZE': '轻度雾霾',
    'MODERATE_HAZE': '中度雾霾',
    'HEAVY_HAZE': '重度雾霾',
    'LIGHT_RAIN': '小雨',
    'MODERATE_RAIN': '中雨',
    'HEAVY_RAIN': '大雨',
    'STORM_RAIN': '暴雨',
    'FOG': '雾',
    'LIGHT_SNOW': '小雪',
    'MODERATE_SNOW': '中雪',
    'HEAVY_SNOW': '大雪',
    'STORM_SNOW': '暴雪',
    'DUST': '浮尘',
    'SAND': '沙尘',
    'WIND': '大风',
  };

  return descMap[skycon] || '未知天气';
}

onMounted(() => {
  // 随机选择一条爱情语录
  const randomIndex = Math.floor(Math.random() * loveQuotes.length);
  randomQuote.value = loveQuotes[randomIndex];

  // 初始化纪念日数据
  initAnniversaries();

  // 计算下一个纪念日
  calculateNextAnniversary();

  // 获取天气数据
  fetchWeatherData();

  // 设置定时器，每秒更新倒计时
  timer = setInterval(updateCountdown, 1000);

  // 设置定时器，每30分钟更新一次天气数据
  weatherTimer = setInterval(fetchWeatherData, 30 * 60 * 1000);
});

onUnmounted(() => {
  // 清除定时器
  if (timer) {
    clearInterval(timer);
  }
  if (weatherTimer) {
    clearInterval(weatherTimer);
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
  background-color: #f8f9fa;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 800px;
  width: 100%;
  padding: 0 20px;
}

/* 通用卡片样式 */
.card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  padding: 25px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  font-size: 22px;
  color: #333;
  margin: 0;
  font-weight: 700;
}

/* 天气卡片样式 */
.weather-card {
  text-align: left;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.weather-location {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.weather-time {
  font-size: 16px;
  color: #666;
}

.weather-content {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.weather-icon {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 50%;
  padding: 10px;
}

.weather-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.weather-info {
  flex: 1;
}

.weather-temp {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.weather-desc {
  font-size: 18px;
  color: #666;
}

.weather-details {
  display: flex;
  justify-content: space-between;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
}

.weather-detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
}

.detail-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.detail-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.weather-forecast {
  font-size: 16px;
  color: #666;
  text-align: center;
  padding: 10px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* 纪念日卡片样式 */
.anniversary-card {
  text-align: center;
}

.anniversary-title {
  font-size: 20px;
  color: #555;
  margin-bottom: 20px;
  font-weight: 500;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.countdown-item {
  display: flex;
  align-items: center;
}

.count-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.count {
  font-size: 36px;
  font-weight: bold;
  color: #ff6b6b;
  background-color: #fff;
  border-radius: 12px;
  padding: 10px 15px;
  min-width: 60px;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.1);
  text-align: center;
  border: 2px solid #ffeded;
}

.unit {
  font-size: 16px;
  color: #666;
  margin-top: 8px;
  font-weight: 500;
}

/* 爱情语录卡片样式 */
.quote-card {
  text-align: center;
  background-color: #fff9f9;
  border-left: 5px solid #ff6b6b;
}

.love-quote {
  font-size: 20px;
  font-style: italic;
  color: #555;
  line-height: 1.6;
  position: relative;
  padding: 0 20px;
}

.love-quote::before,
.love-quote::after {
  content: '"';
  font-size: 40px;
  color: #ffcaca;
  position: absolute;
  font-family: serif;
}

.love-quote::before {
  left: 0;
  top: -10px;
}

.love-quote::after {
  right: 0;
  bottom: -30px;
}

/* 适配暗色模式 */
@media (prefers-color-scheme: dark) {
  .footer-container {
    background-color: #1a1a1a;
  }

  .card {
    background-color: #2a2a2a;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .card-header {
    border-bottom: 1px solid #3a3a3a;
  }

  .card-header h3 {
    color: #eee;
  }

  .weather-location,
  .weather-temp {
    color: #eee;
  }

  .weather-time,
  .weather-desc,
  .detail-label {
    color: #aaa;
  }

  .detail-value {
    color: #ddd;
  }

  .weather-icon {
    background-color: #333;
  }

  .weather-details,
  .weather-forecast {
    background-color: #333;
  }

  .anniversary-title {
    color: #ddd;
  }

  .count {
    background-color: #333;
    color: #ff8a8a;
    border-color: #4a3a3a;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .unit {
    color: #aaa;
  }

  .quote-card {
    background-color: #2d2626;
    border-left: 5px solid #ff6b6b;
  }

  .love-quote {
    color: #ddd;
  }

  .love-quote::before,
  .love-quote::after {
    color: #5a3a3a;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    padding: 0 15px;
  }

  .card {
    padding: 20px;
  }

  .card-header h3 {
    font-size: 20px;
  }

  .weather-location {
    font-size: 18px;
  }

  .weather-time {
    font-size: 14px;
  }

  .weather-icon {
    width: 60px;
    height: 60px;
    margin-right: 15px;
  }

  .weather-temp {
    font-size: 28px;
  }

  .weather-desc {
    font-size: 16px;
  }

  .weather-details {
    padding: 10px;
  }

  .detail-label {
    font-size: 12px;
  }

  .detail-value {
    font-size: 14px;
  }

  .weather-forecast {
    font-size: 14px;
  }

  .anniversary-title {
    font-size: 18px;
  }

  .countdown {
    gap: 10px;
  }

  .count {
    font-size: 28px;
    padding: 8px;
    min-width: 50px;
  }

  .unit {
    font-size: 14px;
  }

  .love-quote {
    font-size: 18px;
    padding: 0 15px;
  }
}

/* 小屏幕手机适配 */
@media (max-width: 480px) {
  .footer-content {
    gap: 20px;
  }

  .card {
    padding: 15px;
  }

  .weather-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .weather-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .weather-details {
    flex-wrap: wrap;
  }

  .weather-detail-item {
    width: 100%;
    margin-bottom: 10px;
  }

  .weather-detail-item:last-child {
    margin-bottom: 0;
  }

  .count {
    font-size: 24px;
    padding: 6px;
    min-width: 40px;
  }

  .unit {
    font-size: 12px;
  }
}
</style>