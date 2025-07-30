<template>
  <div class="todo-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-heart heart-1">💕</div>
      <div class="floating-heart heart-2">💖</div>
      <div class="floating-heart heart-3">✨</div>
      <div class="floating-heart heart-4">🌸</div>
    </div>

    <div id="pjax-container" class="pjax-full-height">
      <div class="central">
        <div class="row central central-800">
          <div v-if="loveEvents.length > 0" class="card col-lg-12 col-md-12 col-sm-12 col-sm-x-12 modern-card">
            <div class="list_texts scrollable-list">
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



    return {
      loveEvents,
      sortedEvents,
      formatDate
    };
  }
};
</script>

<style scoped>
/* 容器样式 - 占满整个屏幕 */
.todo-container {
  position: fixed;
  top: 4.5rem; /* 从Header下方开始 */
  left: 0;
  right: 0;
  bottom: 0;
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
  opacity: 0.2;
  /* 移除动画效果 */
}

.heart-1 {
  top: 10%;
  left: 10%;
}

.heart-2 {
  top: 20%;
  right: 15%;
}

.heart-3 {
  bottom: 30%;
  left: 20%;
}

.heart-4 {
  bottom: 15%;
  right: 10%;
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
  cursor: default;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 182, 193, 0.2);
  /* 移除所有动画和过渡效果以提升滚动性能 */
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
  padding: 1.5rem 1rem 1rem 1rem; /* 修复右侧padding */
  box-sizing: border-box;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.scrollable-list::-webkit-scrollbar {
  width: 32px;
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
  /* 移除动画效果 */
}

.checkbox.checked {
  background: linear-gradient(135deg, #00d4aa, #00a085);
  border-color: #00d4aa;
}

.checkmark {
  width: 14px;
  height: 14px;
  color: white;
  /* 移除动画效果 */
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
  /* 移除动画效果 */
}

/* 完成徽章 */
.completion-badge {
  background: linear-gradient(135deg, #00d4aa, #00a085);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  /* 移除动画效果 */
}

/* 移动端优化 */
@media (max-width: 768px) {
  .todo-container {
    position: fixed;
    top: 4.5rem;
    left: 0;
    right: 0;
    bottom: 0;
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
    padding: 1.5rem 0.75rem 0.75rem 0.75rem; /* 保持顶部padding避免遮挡 */
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
    position: fixed;
    top: 4.5rem;
    left: 0;
    right: 0;
    bottom: 0;
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
    padding: 1.5rem 0.5rem 0.5rem 0.5rem; /* 保持顶部padding避免遮挡 */
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