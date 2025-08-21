<template>
  <div class="memory-page">
    <!-- 头部 -->
    <div style="padding-top: 48px"></div>
    <div class="memory-header">
      <h1 class="memory-title">珍藏每一个回忆</h1>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <button
          v-for="category in categories"
          :key="category.key"
          class="category-btn"
          :class="{ active: activeCategory === category.key }"
          @click="setActiveCategory(category.key)"
      >
        {{ category.label }}
      </button>
    </div>

    <!-- 记忆列表容器 -->
    <div class="memories-container" ref="memoriesContainer">
      <div class="memories-list">
        <MemoryCard
            v-for="memory in filteredMemories"
            :key="memory.id"
            :memory="memory"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import MemoryCard from "@/components/Memory/MemoryCard.vue";

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
});

const activeCategory = ref('all');
const memoriesContainer = ref(null);
let touchStartY = 0;
let touchMoveY = 0;
let isScrolling = false;

// 监听活动状态变化
watch(() => props.active, (newValue) => {
  if (newValue) {
    // 当页面激活时，重置滚动位置
    if (memoriesContainer.value) {
      memoriesContainer.value.scrollTop = 0;
    }
  }
});

// 处理触摸事件，防止与Swiper冲突
onMounted(() => {
  if (memoriesContainer.value) {
    memoriesContainer.value.addEventListener('touchstart', handleTouchStart, { passive: false });
    memoriesContainer.value.addEventListener('touchmove', handleTouchMove, { passive: false });
    memoriesContainer.value.addEventListener('wheel', handleWheel, { passive: false });
  }
});

const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY;
  isScrolling = false;
};

const handleTouchMove = (e) => {
  if (!memoriesContainer.value) return;

  touchMoveY = e.touches[0].clientY;
  const scrollTop = memoriesContainer.value.scrollTop;
  const scrollHeight = memoriesContainer.value.scrollHeight;
  const containerHeight = memoriesContainer.value.clientHeight;

  // 向下滑动且已经到达顶部
  if (touchMoveY > touchStartY && scrollTop <= 0) {
    // 允许Swiper处理
    isScrolling = false;
  }
  // 向上滑动且已经到达底部
  else if (touchMoveY < touchStartY && scrollTop + containerHeight >= scrollHeight) {
    // 允许Swiper处理
    isScrolling = false;
  }
  // 内容区域滚动
  else {
    isScrolling = true;
    e.stopPropagation(); // 阻止事件冒泡到Swiper
  }
};

const handleWheel = (e) => {
  if (!memoriesContainer.value) return;

  const scrollTop = memoriesContainer.value.scrollTop;
  const scrollHeight = memoriesContainer.value.scrollHeight;
  const containerHeight = memoriesContainer.value.clientHeight;

  // 向下滚动且已经到达顶部
  if (e.deltaY < 0 && scrollTop <= 0) {
    // 允许Swiper处理
  }
  // 向上滚动且已经到达底部
  else if (e.deltaY > 0 && scrollTop + containerHeight >= scrollHeight - 5) {
    // 允许Swiper处理
  }
  // 内容区域滚动
  else {
    e.stopPropagation(); // 阻止事件冒泡到Swiper
  }
};

// 修改图片路径，使用相对路径或公共路径
const memories = ref([
  {
    id: 1,
    title: "告白の日",
    date: "2025-06-06",
    location: "中央公园",
    description: "小番茄趣事、茶颜悦色、马记永、狼狈表白",
    category: "特别日子",
    images: ["/img/memory/20250606.jpg"]
  },
  {
    id: 2,
    title: "第一次约会",
    date: "2025-06-10",
    location: "狮山公园",
    description: "三千粉米线、牵手、依依不舍",
    category: "约会",
    images: ["/img/memory/20250610.jpg"]
  },
  {
    id: 3,
    title: "公园散步",
    date: "2025-06-13",
    location: "石湖公园",
    description: "重庆小面、RIO、萤火虫",
    category: "约会",
    images: ["/img/memory/20250613.jpg"]
  },
  {
    id: 4,
    title: "平姐生日",
    date: "2025-06-21",
    location: "胥江龙湖",
    description: "黔夺夺、KTV、山姆超市、鑫花溪、台球",
    category: "约会",
    images: ["/img/memory/20250621.jpg"]
  },
  {
    id: 5,
    title: "宅家看电影",
    date: "2025-06-22",
    location: "家",
    description: "紫燕百味鸡、《夏洛特烦恼》",
    category: "日常",
    images: ["/img/memory/20250622.jpg"]
  },
  {
    id: 6,
    title: "周六小逛",
    date: "2025-07-19",
    location: "苏州中心",
    description: "蛙喔牛蛙、音乐喷泉、KKV、抓娃娃",
    category: "约会",
    images: [
      "/img/memory/20250719-1.jpg",
      "/img/memory/20250719-2.jpg"
    ]
  },
  {
    id: 7,
    title: "第一次在家做饭",
    date: "2025-08-20",
    location: "家",
    description: "红烧鸡翅根、酸辣土豆丝、美味好吃",
    category: "日常",
    images: [
      "/img/memory/20250820.jpg"
    ]
  }
])

const categories = [
  { key: 'all', label: '全部回忆' },
  { key: '约会', label: '约会' },
  { key: '旅行', label: '旅行' },
  { key: '特别日子', label: '特别日子' },
  { key: '日常', label: '日常' },
  { key: '礼物', label: '礼物' }
]

const filteredMemories = computed(() => {
  return activeCategory.value === 'all'
      ? memories.value
      : memories.value.filter(memory => memory.category === activeCategory.value)
})

const setActiveCategory = (category) => {
  activeCategory.value = category
  // 重置滚动位置
  if (memoriesContainer.value) {
    memoriesContainer.value.scrollTop = 0;
  }
}
</script>

<style scoped>
/* 主容器 */
.memory-page {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e6fff9, #f0fffc);
  display: flex;
  flex-direction: column;
  font-family: '微软雅黑', sans-serif;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 头部样式 */
.memory-header {
  text-align: center;
  padding: 0.5rem 0;
  flex-shrink: 0;
}

.memory-title {
  font-size: 2.2rem;
  font-weight: bold;
  font-family: '微软雅黑', sans-serif;
  background: linear-gradient(45deg, #00d4aa, #00a085);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  flex-shrink: 0;
  padding: 0 5px;
}

.category-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  margin-bottom: 8px;
}

.category-btn:hover,
.category-btn.active {
  background: linear-gradient(45deg, #00d4aa, #00a085);
  color: white;
  transform: translateY(-2px);
}

/* 记忆容器 */
.memories-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  -webkit-overflow-scrolling: touch; /* 增强iOS滚动体验 */
  touch-action: pan-y; /* 允许垂直平移 */
}

.memories-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-right: 10px;
  padding-bottom: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* 滚动条样式 */
.memories-container::-webkit-scrollbar {
  width: 8px;
}

.memories-container::-webkit-scrollbar-track {
  background: rgba(0, 212, 170, 0.1);
  border-radius: 4px;
}

.memories-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #00d4aa, #00a085);
  border-radius: 4px;
}

.memories-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #00a085, #008066);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .memory-page {
    padding: 10px;
  }

  .memory-title {
    font-size: 1.8rem;
  }

  .memories-list {
    gap: 12px;
    padding-right: 0;
  }

  .category-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .memory-page {
    padding: 10px 5px;
  }

  .memory-title {
    font-size: 1.5rem;
  }

  .memories-list {
    gap: 10px;
  }

  .category-nav {
    gap: 6px;
  }

  .category-btn {
    padding: 5px 10px;
    font-size: 11px;
    margin-bottom: 5px;
  }
}
</style>