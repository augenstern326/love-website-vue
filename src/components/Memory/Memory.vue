<template>
  <div class="memory-page">
    <!-- 头部 -->
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

    <!-- 记忆网格容器 -->
    <div class="memories-container">
      <div class="memories-grid">
        <div
            v-for="memory in filteredMemories"
            :key="memory.id"
            class="memory-card"
        >
          <!-- 图片占位符 -->
          <div class="memory-image">
            <div class="image-placeholder">
              <img :src="memory.images[0]">
            </div>
          </div>

          <!-- 内容 -->
          <div class="memory-content">
            <h3 class="memory-card-title">{{ memory.title }}</h3>

            <div class="memory-meta">
              <div class="memory-date">📅 {{ memory.date }}</div>
              <div class="memory-location">📍 {{ memory.location }}</div>
            </div>

            <p class="memory-description">{{ memory.description }}</p>

            <div class="memory-category">{{ memory.category }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('all')

const memories = ref([
  {
    id: 1,
    title: "告白の日",
    date: "2025-06-06",
    location: "中央公园",
    description: "小番茄趣事、茶颜悦色、马记永、狼狈表白",
    category: "特别日子",
    images: ["/src/assets/img/memory/20250606.jpg"]
  },
  {
    id: 2,
    title: "第一次约会",
    date: "2025-06-10",
    location: "狮山公园",
    description: "三千粉米线、牵手、依依不舍",
    category: "约会",
    images: ["/src/assets/img/memory/20250610.jpg"]
  },
  {
    id: 3,
    title: "公园散步",
    date: "2025-06-13",
    location: "石湖公园",
    description: "重庆小面、RIO、萤火虫",
    category: "约会",
    images: ["/src/assets/img/memory/20250613.jpg"]
  },
  {
    id: 4,
    title: "平姐生日",
    date: "2025-06-21",
    location: "胥江龙湖",
    description: "黔夺夺、KTV、山姆超市、鑫花溪、台球",
    category: "约会",
    images: ["/src/assets/img/memory/20250621.jpg"]
  },
  {
    id: 5,
    title: "宅家看电影",
    date: "2025-06-22",
    location: "家",
    description: "紫燕百味鸡、《夏洛特烦恼》",
    category: "日常",
    images: ["/src/assets/img/memory/20250622.jpg"]
  },
  {
    id: 6,
    title: "周六小逛",
    date: "2025-07-19",
    location: "苏州中心",
    description: "蛙喔牛蛙、音乐喷泉、KKV、抓娃娃",
    category: "约会",
    images: [
      "/src/assets/img/memory/20250719-1.jpg",
      "/src/assets/img/memory/20250719-2.jpg"
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
}
</script>

<style scoped>
/* 主容器 */
.memory-page {
  width: 100%;
  height: 100vh;
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
  padding: 1rem 0;
  flex-shrink: 0;
}

.memory-title {
  font-size: 2.5rem;
  font-weight: bold;
  font-family: '龚帆乐淘体', serif;
  background: linear-gradient(45deg, #00d4aa, #00a085);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.memory-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  flex-shrink: 0;
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
  overflow: hidden;
  position: relative;
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
  padding-bottom: 20px;
}

/* 滚动条样式 */
.memories-grid::-webkit-scrollbar {
  width: 8px;
}

.memories-grid::-webkit-scrollbar-track {
  background: rgba(0, 212, 170, 0.1);
  border-radius: 4px;
}

.memories-grid::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #00d4aa, #00a085);
  border-radius: 4px;
}

.memories-grid::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #00a085, #008066);
}

/* 记忆卡片 */
.memory-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: fit-content;
}

.memory-card:hover {
  transform: translateY(-5px);
}

.memory-image {
  height: 150px;
  position: relative;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #e6fff9, #f0fffc);
  font-size: 3rem;
  color: #00d4aa;
}

.memory-content {
  padding: 1.5rem;
}

.memory-card-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.memory-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
  flex-wrap: wrap;
}

.memory-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.memory-category {
  display: inline-block;
  background: linear-gradient(45deg, #00d4aa, #00a085);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .memory-page {
    padding: 10px;
  }

  .memory-title {
    font-size: 2rem;
  }

  .memories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .memory-content {
    padding: 1rem;
  }

  .memory-card-title {
    font-size: 1.1rem;
  }

  .memory-meta {
    font-size: 0.8rem;
    gap: 10px;
  }

  .memory-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .memories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .memory-content {
    padding: 0.8rem;
  }

  .memory-card-title {
    font-size: 1rem;
  }

  .memory-meta {
    font-size: 0.75rem;
  }

  .memory-description {
    font-size: 0.85rem;
  }
}
</style>
