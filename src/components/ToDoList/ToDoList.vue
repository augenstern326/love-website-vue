<template>
  <!-- 头部 -->
  <div style="padding-top: 48px"></div>
  <div class="todo-container swiper-slide">
    <div id="pjax-container" class="pjax-full-height">
      <div class="central">
        <div class="row central central-800">
          <div v-if="loveEvents.length > 0" class="card col-lg-12 col-md-12 col-sm-12 col-sm-x-12 modern-card">
            <div class="list-header">
              <div class="list-stats">
                <span class="completed-count">已完成: {{ completedCount }}</span>
                <span class="total-count">总计: {{ loveEvents.length }}</span>
              </div>
            </div>
            <div class="list_texts scrollable-list">
              <ul class="lovelist modern-list">
                <li
                    v-for="(event, index) in sortedEvents"
                    :key="event.id"
                    :class="['event-item', 'modern-item', { 'completed': event.status, 'pending': !event.status }]"
                    @click="toggleEventStatus(event)"
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

                    <span :class="['event-title', { 'completed-text': event.status }]">
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
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ToDoList',
  props: {
    text: {
      type: Object,
      default: () => ({ title: '恋爱事件', Animation: '1' })
    },
    swiperInstance: {
      type: Object,
      default: null
    }
  },
  setup(props) {
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
        name: '一起住进大House🏠',
        status: false
      },
      {
        id: 4,
        name: '一起拥有一辆小汽车🚗',
        status: false
      },
      {
        id: 5,
        name: '一起听一场演唱会🎤',
        status: false
      },
      {
        id:6,
        name: '一起去爬山⛰',
        status: false
      },
      {
        id:7,
        name: '一起去游乐园🎡',
        status: false
      },
      {
        id:8,
        name: '一起外出旅游📸',
        status: false
      },
      {
        id:9,
        name:'一起看烟花🎆',
        status: false
      },
      {
        id: 10,
        name: '一起去电影院看电影🎬',
        status: true
      },
      {
        id:11,
        name: '一起赖一次床🛏️',
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
        name:'一起去按摩💆',
        status: false
      },
      {
        id:15,
        name:'一起DIY手工🎨',
        status: false
      },
      {
        id:16,
        name:'一起看日出看日落🌅',
        status: false
      }
    ]);

    // 排序事件：未完成的在前，已完成的在后
    const sortedEvents = computed(() => {
      return [...loveEvents.value].sort((a, b) => {
        // 未完成的(false)排在前面，已完成的(true)排在后面
        if (a.status === b.status) return 0;
        return a.status ? 1 : -1;
      });
    });

    // 计算已完成事件数量
    const completedCount = computed(() => {
      return loveEvents.value.filter(event => event.status).length;
    });

    // 切换事件状态
    const toggleEventStatus = (event) => {
      event.status = !event.status;
      // 这里可以添加保存到本地存储或发送到服务器的逻辑
      saveToLocalStorage();
    };

    // 保存到本地存储
    const saveToLocalStorage = () => {
      localStorage.setItem('loveEvents', JSON.stringify(loveEvents.value));
    };

    // 从本地存储加载
    const loadFromLocalStorage = () => {
      const savedEvents = localStorage.getItem('loveEvents');
      if (savedEvents) {
        loveEvents.value = JSON.parse(savedEvents);
      }
    };

    // 生命周期钩子
    onMounted(() => {
      loadFromLocalStorage();

      // 添加Swiper相关的初始化逻辑
      if (props.swiperInstance) {
        // 可以在这里添加swiper相关的事件监听
        props.swiperInstance.on('slideChangeTransitionEnd', () => {
          // 当滑动到此页面时的逻辑
        });
      }
    });

    onUnmounted(() => {
      // 清理Swiper相关的事件监听
      if (props.swiperInstance) {
        props.swiperInstance.off('slideChangeTransitionEnd');
      }
    });

    // Format date for display
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('zh-CN', options);
    };

    return {
      loveEvents,
      sortedEvents,
      completedCount,
      formatDate,
      toggleEventStatus
    };
  }
};
</script>

<style scoped>
/* 容器样式 - 适配Swiper */
.todo-container {
  position: relative;
  height: 100%;
  width: 100%;
  background: transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pjax-full-height {
  height: 100%;
  width: 100%;
}

.central {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

.row {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 列表标题样式 */
.list-header {
  padding: 1.5rem 1.5rem 0.5rem;
  display: flex;
  justify-content: right;
  align-items: center;
  font-size: 1.2rem;
  border-bottom: 1px solid rgba(255, 182, 193, 0.2);
}

.list-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  padding-left: 1.2rem;
  color: #00d4aa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Glorious Easter TTF Personal', serif;
}

.list-stats {
  display: flex;
  gap:1rem;
  color: #666;
}

.completed-count {
  color: #00a085;
  font-weight: 500;
  font-size: 1.2rem;
}
.total-count {
  color: #00a085;
  font-weight: 500;
  font-size: 1.2rem;
}


@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(15px) rotate(-5deg);
  }
}

/* 基础卡片样式 */
.card {
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: visible; /* 允许滚动条显示 */
  box-sizing: border-box;
}

/* 现代化卡片样式 - 严格控制尺寸 */
.modern-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 0;
  box-shadow: none;
  border: none;
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: visible; /* 允许滚动条显示 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 列表容器样式 */
.list_texts {
  height: 100%;
  max-height: 100%;
  overflow: visible; /* 允许滚动条显示 */
  display: flex;
  flex-direction: column;
}

/* 列表样式 */
.modern-list {
  padding: 0;
  margin: 0;
  height: 100%;
  max-height: 100%;
  /* 不设置overflow，让父容器scrollable-list处理滚动 */
  flex: 1;
}

.modern-item {
  list-style: none;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 182, 193, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.modern-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.modern-item.completed {
  background: linear-gradient(135deg, rgba(25, 255, 160, 0.1), rgba(144, 238, 144, 0.1));
  border-color: rgba(25, 255, 160, 0.3);
}

.modern-item.pending {
  background: rgba(255, 255, 255, 0.8);
}

/* 滚动容器样式 - 严格限制在卡片内部 */
.scrollable-list {
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 1rem 1rem 1rem; /* 修复右侧padding */
  box-sizing: border-box;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.scrollable-list::-webkit-scrollbar {
  width: 8px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: rgba(0, 212, 170, 0.1);
  border-radius: 4px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #00d4aa, #00d4aa);
  border-radius: 4px;
}

.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #00a085, #00d4aa);
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
  background: white;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox.checked {
  background: linear-gradient(135deg, #00d4aa, #00a085);
  border-color: #00d4aa;
}

.checkmark {
  width: 14px;
  height: 14px;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkbox.checked .checkmark {
  opacity: 1;
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
  font-family: 'Noto Serif SC', serif;
  text-align: left;
  line-height: 1.5;
  transition: color 0.2s ease;
}

.completed-text {
  color: #00a085;
  text-decoration: line-through;
  opacity: 0.8;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .todo-container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .list-header {
    padding: 1rem 1rem 0.5rem;
  }

  .list-title {
    font-size: 1.3rem;
  }

  .list-stats {
    font-size: 0.8rem;
    gap: 0.5rem;
  }

  .modern-card {
    height: 100%;
    max-height: 100%;
    width: 100%;
    max-width: 100%;
    border-radius: 0;
    margin: 0;
    padding: 0;
    background: rgba(255, 255, 255, 0.98);
    box-sizing: border-box;
    overflow: hidden;
  }

  .scrollable-list {
    padding: 0.75rem 0.75rem 0.75rem 0.75rem;
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
  .todo-container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .list-header {
    padding: 0.75rem 0.75rem 0.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .list-title {
    font-size: 1.2rem;
  }

  .modern-card {
    border-radius: 0;
    margin: 0;
    padding: 0;
    height: 100%;
    max-height: 100%;
    width: 100%;
    max-width: 100%;
    background: rgba(255, 255, 255, 0.98);
    box-sizing: border-box;
    overflow: hidden;
  }

  .scrollable-list {
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
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