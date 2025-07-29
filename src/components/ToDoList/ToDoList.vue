<template>
  <div class="todo-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-heart heart-1">💕</div>
      <div class="floating-heart heart-2">💖</div>
      <div class="floating-heart heart-3">✨</div>
      <div class="floating-heart heart-4">🌸</div>
    </div>

    <div id="pjax-container">
      <div class="central">
        <div class="row central central-800">
          <div v-if="loveEvents.length > 0" class="card col-lg-12 col-md-12 col-sm-12 col-sm-x-12 modern-card">

            <!-- 标题和进度统计 -->
            <div class="todo-header">
              <h2 class="todo-title">
                <span class="title-icon">💝</span>
                我们的爱情清单
                <span class="title-icon">💝</span>
              </h2>
              <div class="progress-stats">
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                </div>
                <div class="progress-text">
                  已完成 {{ completedCount }}/{{ totalCount }} 项 ({{ Math.round(progressPercentage) }}%)
                </div>
              </div>
            </div>

            <div :class="['list_texts', 'scrollable-list', { 'animated fadeInUp delay-03s': text.Animation === '1' }]">
              <ul class="lovelist modern-list">
                <li
                  v-for="(event, index) in sortedEvents"
                  :key="event.id"
                  :class="['event-item', 'modern-item', { 'completed': event.status, 'pending': !event.status }]"
                >
                  <div class="event-content">
                    <!-- 勾选框 -->
                    <div class="checkbox-container">
                      <div :class="['checkbox', { 'checked': event.status }]">
                        <svg v-if="event.status" class="checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      </div>
                    </div>

                    <span class="event-title">
                      {{ event.name }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'ToDoList',
  props: {
    text: {
      type: Object,
      default: () => ({ title: '恋爱事件', Animation: '1' })
    }
  },
  setup() {
    // Mock data - replace with actual API call in production
    const loveEvents = ref([
      {
        id: 1,
        name: '一起在厨房做早餐/午餐🍲',
        status: false
      },
      {
        id: 2,
        name: '一起养只可爱的猫猫🐱',
        status: false
      },
      {
        id: 3,
        name: '一起住进自己的大House🏠',
        status: false
      },
      {
        id: 4,
        name: '一起拥有自己的小汽车🚗',
        status: false
      },
      {
        id: 5,
        name: '一起听一场演唱会🎤',
        status: false
      },
      {
        id:7,
        name: '一起去爬山⛰',
        status: false
      },
      {
        id:11,
        name: '一起去游乐园🎡',
        status: false
      },
      {
        id:8,
        name: '一起去旅游📸',
        status: false
      },
      {
        id:12,
        name:'一起看烟花🎆',
        status: false
      },
      {
        id: 6,
        name: '一起去电影院看电影🎬',
        status: true
      },
      {
        id:9,
        name: '一起赖一次床🛏️',
        status: true
      },
      {
        id:10,
        name: '一起下班后散步',
        status: true
      },
      {
        id:12,
        name: '一起在下雨天追剧📺',
        status: true
      },
      {
        id:13,
        name:'一起做蛋糕甜点🍰',
        status: false
      },
      {
        id:14,
        name:'一起按摩💆',
        status: false
      },
      {
        id:15,
        name:'一起做DIY🎨',
        status: false
      },
      {
        id:16,
        name:'一起看日出看日落🌅',
        status: false
      }
    ]);

    // 移除expandedEvents相关代码，因为现在直接切换完成状态

    // 排序事件：未完成的在前，已完成的在后
    const sortedEvents = computed(() => {
      return [...loveEvents.value].sort((a, b) => {
        // 未完成的(false)排在前面，已完成的(true)排在后面
        if (a.status === b.status) return 0;
        return a.status ? 1 : -1;
      });
    });

    // Format date for display
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('zh-CN', options);
    };

    // 计算进度统计
    const completedCount = computed(() => {
      return loveEvents.value.filter(event => event.status === true).length;
    });

    const totalCount = computed(() => {
      return loveEvents.value.length;
    });

    const progressPercentage = computed(() => {
      return totalCount.value > 0 ? (completedCount.value / totalCount.value) * 100 : 0;
    });

    return {
      loveEvents,
      sortedEvents,
      formatDate,
      completedCount,
      totalCount,
      progressPercentage
    };
  }
};
</script>

<style scoped>
/* 容器样式 - 与整体背景保持一致 */
.todo-container {
  position: relative;
  min-height: 100vh;
  background: transparent;
  overflow: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-heart {
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.heart-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.heart-2 {
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.heart-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 4s;
}

.heart-4 {
  bottom: 15%;
  right: 10%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* 现代化卡片样式 */
.modern-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

/* 标题区域 */
.todo-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 182, 193, 0.2);
  margin-bottom: 1rem;
}

.todo-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b9d, #c44569, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  font-family: 'Noto Serif SC', serif;
}

.title-icon {
  margin: 0 0.5rem;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 进度统计 */
.progress-stats {
  max-width: 400px;
  margin: 0 auto;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 182, 193, 0.3);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff6b9d, #c44569, #9b59b6);
  border-radius: 10px;
  transition: width 0.8s ease;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* 列表样式 */
.modern-list {
  padding: 0;
  margin: 0;
}

.modern-item {
  list-style: none;
  margin-bottom: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: default;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.modern-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.modern-item.completed {
  background: linear-gradient(135deg, rgba(25, 255, 160, 0.1), rgba(144, 238, 144, 0.1));
  border-color: rgba(25, 255, 160, 0.3);
}

.modern-item.pending {
  background: rgba(255, 255, 255, 0.8);
}

/* 滚动容器样式 */
.scrollable-list {
  max-height: 75vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.scrollable-list::-webkit-scrollbar {
  width: 6px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: rgba(255, 182, 193, 0.1);
  border-radius: 3px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #ff5a8a, #b8456b);
}

/* 勾选框样式 */
.checkbox-container {
  margin-right: 1rem;
  flex-shrink: 0;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: white;
  position: relative;
}

.checkbox.checked {
  background: linear-gradient(135deg, #19ffa0, #00d4aa);
  border-color: #19ffa0;
  box-shadow: 0 2px 8px rgba(25, 255, 160, 0.3);
}

.checkmark {
  width: 14px;
  height: 14px;
  color: white;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease;
}

.checkbox.checked .checkmark {
  opacity: 1;
  transform: scale(1);
}

.event-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem;
  position: relative;
}

/* 事件标题 */
.event-title {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  transition: all 0.3s ease;
  font-family: 'Noto Serif SC', serif;
  text-align: left;
  line-height: 1.5;
}

/* 完成徽章 */
.completion-badge {
  background: linear-gradient(135deg, #19ffa0, #00d4aa);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .todo-title {
    font-size: 1.5rem;
  }

  .todo-header {
    padding: 1.5rem 1rem 1rem;
  }

  .scrollable-list {
    max-height: 65vh;
    padding-right: 0.25rem;
  }

  .event-content {
    padding: 1rem;
  }

  .event-title {
    font-size: 1rem;
  }

  .checkbox {
    width: 18px;
    height: 18px;
  }

  .checkmark {
    width: 12px;
    height: 12px;
  }

  .floating-heart {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .todo-title {
    font-size: 1.3rem;
  }

  .progress-stats {
    max-width: 100%;
  }

  .scrollable-list {
    max-height: 60vh;
  }

  .event-content {
    padding: 0.8rem;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .checkbox {
    width: 16px;
    height: 16px;
  }

  .checkmark {
    width: 10px;
    height: 10px;
  }

  .completion-badge {
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
  }
}

/* 兼容原有样式 */
.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.3em;
  fill: currentColor;
  overflow: hidden;
}

li.cike {
  border-bottom: 1px solid #ddd;
}

li {
  list-style-type: none;
}
</style>