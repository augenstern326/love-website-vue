<template>
  <div
      class="min-h-screen relative overflow-hidden"
      :style="{
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }"
  >
    <!-- 背景遮罩 -->
    <div
        class="absolute inset-0 bg-white/30 backdrop-blur-sm"
        :style="backgroundMaskStyle"
    />

    <!-- 浮动装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-20 left-10" :style="heartAnimationStyle">
        <Heart class="w-8 h-8 text-pink-400/60" />
      </div>
      <div class="absolute top-40 right-20" :style="sparklesAnimationStyle">
        <Sparkles class="w-6 h-6 text-purple-400/60" />
      </div>
      <div class="absolute bottom-20 left-1/4" :style="cameraAnimationStyle">
        <Camera class="w-7 h-7 text-pink-500/50" />
      </div>
    </div>

    <!-- 主内容 -->
    <div class="relative z-10">
      <!-- 头部 -->
      <header class="pt-16 sm:pt-20 pb-8 sm:pb-12 text-center px-4" :style="headerStyle">
        <h1
            class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 mb-3 sm:mb-4"
            :style="titleAnimationStyle"
        >
          我们的浪漫回忆
        </h1>
        <p class="text-base sm:text-lg text-gray-700 flex items-center justify-center space-x-2 flex-wrap" :style="subtitleStyle">
          <Heart class="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
          <span class="text-center">珍藏我们在一起的每一个美好瞬间</span>
          <Heart class="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
        </p>
      </header>

      <!-- 分类导航 -->
      <div class="max-w-6xl mx-auto px-4 mb-6 sm:mb-8" :style="categoryNavStyle">
        <div class="flex flex-wrap justify-center gap-2 sm:gap-3">
          <button
              v-for="category in categories"
              :key="category.key"
              class="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base touch-manipulation"
              :class="{
              'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg': activeCategory === category.key,
              'bg-white/80 text-gray-700 hover:bg-white/90 hover:shadow-md': activeCategory !== category.key
            }"
              @click="setActiveCategory(category.key)"
              :style="buttonHoverStyle"
          >
            <component :is="category.icon" class="w-3 h-3 sm:w-4 sm:h-4" />
            <span class="hidden sm:inline">{{ category.label }}</span>
            <span class="sm:hidden">{{ category.label.slice(0, 2) }}</span>
          </button>
        </div>
      </div>

      <!-- 记忆网格 -->
      <div class="max-w-6xl mx-auto px-3 sm:px-4 pb-8 sm:pb-12" :style="memoriesGridStyle">
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <MemoryCard
              v-for="(memory, index) in filteredMemories"
              :key="memory.id"
              :memory="memory"
              :index="index"
              :loaded-images="loadedImages"
              :failed-images="failedImages"
          />
        </div>
      </div>

      <!-- 底部 -->
      <footer class="text-center py-6 sm:py-8" :style="footerStyle">
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-3 sm:p-4 mx-3 sm:mx-4 max-w-md mx-auto">
          <p class="text-gray-600 flex items-center justify-center space-x-2 text-sm sm:text-base">
            <Heart class="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
            <span>用心珍藏，用爱守护</span>
            <Sparkles class="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue'
import { Heart, Sparkles, ChevronLeft, ChevronRight, MapPin, Calendar, Camera, Image as ImageIcon, Gift, CalendarHeart, Cloud } from 'lucide-vue-next'
import MemoryCard from './MemoryCard.vue'

export default {
  components: {
    Heart,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Calendar,
    Camera,
    ImageIcon,
    Gift,
    CalendarHeart,
    Cloud,
    MemoryCard
  },
  setup() {
    const activeCategory = ref('all')
    const showForm = ref(false)
    const memories = ref([
      {
        id: 1,
        title: "告白の日",
        date: "2025-06-06",
        location: "中央公园",
        description: "小番茄趣事、茶颜悦色、马记永、狼狈表白",
        category: "特别日子",
        images: [new URL('@/assets/img/memory/20250606.jpg', import.meta.url).href]
      },
      {
        id: 2,
        title: "第一次约会",
        date: "2025-06-10",
        location: "狮山公园",
        description: "三千粉米线、牵手、依依不舍",
        category: "约会",
        images: [new URL('@/assets/img/memory/20250610.jpg', import.meta.url).href]
      },
      {
        id: 3,
        title: "公园散步",
        date: "2025-06-13",
        location: "石湖公园",
        description: "重庆小面、RIO、萤火虫",
        category: "约会",
        images: [new URL('@/assets/img/memory/20250613.jpg', import.meta.url).href]
      },
      {
        id: 4,
        title: "平姐生日",
        date: "2025-06-21",
        location: "胥江龙湖",
        description: "黔夺夺、KTV、山姆超市、鑫花溪、台球",
        category: "约会",
        images: [new URL('@/assets/img/memory/20250621.jpg', import.meta.url).href]
      },
      {
        id: 5,
        title: "宅家看电影",
        date: "2025-06-22",
        location: "家",
        description: "紫燕百味鸡、《夏洛特烦恼》",
        category: "日常",
        images: [new URL('@/assets/img/memory/20250622.jpg', import.meta.url).href]
      },
      {
        id: 6,
        title: "周六小逛",
        date: "2025-07-19",
        location: "苏州中心",
        description: "蛙喔牛蛙、音乐喷泉、KKV、抓娃娃",
        category: "约会",
        images: [
          new URL('@/assets/img/memory/20250719-1.jpg', import.meta.url).href,
          new URL('@/assets/img/memory/20250719-2.jpg', import.meta.url).href
        ]
      }
    ])

    const categories = [
      { key: 'all', label: '全部回忆', icon: Cloud },
      { key: '约会', label: '约会', icon: Heart },
      { key: '旅行', label: '旅行', icon: Camera },
      { key: '特别日子', label: '特别日子', icon: Sparkles },
      { key: '日常', label: '日常', icon: CalendarHeart },
      { key: '礼物', label: '礼物', icon: Gift }
    ]

    const filteredMemories = computed(() => {
      return activeCategory.value === 'all'
          ? memories.value
          : memories.value.filter(memory => memory.category === activeCategory.value)
    })

    const setActiveCategory = (category) => {
      activeCategory.value = category
    }

    const addMemory = (memory) => {
      memories.value = [...memories.value, { ...memory, id: memories.value.length + 1 }]
      showForm.value = false
    }

    // 预加载图片逻辑
    const loadedImages = ref(new Set())
    const failedImages = ref(new Set())

    const preloadImages = () => {
      const allImageUrls = memories.value.flatMap(memory => memory.images)
      allImageUrls.forEach(url => {
        const img = new Image()
        img.onload = () => {
          loadedImages.value = new Set([...loadedImages.value, url])
        }
        img.onerror = () => {
          failedImages.value = new Set([...failedImages.value, url])
        }
        img.src = url
      })
    }

    onMounted(() => {
      preloadImages()
    })

    // 动画样式
    const backgroundMaskStyle = reactive({
      opacity: 0,
      animation: 'fadeIn 1s forwards'
    })

    const heartAnimationStyle = reactive({
      animation: 'float 3s infinite ease-in-out'
    })

    const sparklesAnimationStyle = reactive({
      animation: 'pulse 2s infinite ease-in-out'
    })

    const cameraAnimationStyle = reactive({
      animation: 'swing 4s infinite ease-in-out'
    })

    const headerStyle = reactive({
      opacity: 0,
      transform: 'translateY(-50px)',
      animation: 'slideDown 0.8s forwards'
    })

    const titleAnimationStyle = reactive({
      animation: 'scalePulse 3s infinite ease-in-out'
    })

    const subtitleStyle = reactive({
      opacity: 0,
      animation: 'fadeIn 0.6s 0.5s forwards'
    })

    const categoryNavStyle = reactive({
      opacity: 0,
      transform: 'translateY(30px)',
      animation: 'slideUp 0.6s 0.3s forwards'
    })

    const memoriesGridStyle = reactive({
      opacity: 0,
      animation: 'fadeIn 0.8s 0.6s forwards'
    })

    const footerStyle = reactive({
      opacity: 0,
      animation: 'fadeIn 0.6s 1s forwards'
    })

    const buttonHoverStyle = {
      '--hover-scale': 1.05,
      '--active-scale': 0.95
    }

    return {
      activeCategory,
      showForm,
      memories,
      categories,
      filteredMemories,
      setActiveCategory,
      addMemory,
      loadedImages,
      failedImages,
      backgroundMaskStyle,
      heartAnimationStyle,
      sparklesAnimationStyle,
      cameraAnimationStyle,
      headerStyle,
      titleAnimationStyle,
      subtitleStyle,
      categoryNavStyle,
      memoriesGridStyle,
      footerStyle,
      buttonHoverStyle
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes swing {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}

@keyframes scalePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

button {
  transition: transform 0.2s;
}

button:hover {
  transform: scale(var(--hover-scale, 1.05));
}

button:active {
  transform: scale(var(--active-scale, 0.95));
}

/* 移动端优化样式 */
@media (max-width: 768px) {
  /* 触摸优化 */
  .touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  /* 移动端按钮优化 */
  button {
    min-height: 44px;
    min-width: 44px;
  }

  /* 移动端间距优化 */
  .max-w-6xl {
    max-width: 100%;
  }

  /* 移动端背景优化 */
  .min-h-screen {
    min-height: 100vh;
    min-height: 100dvh; /* 动态视口高度 */
  }

  /* 移动端浮动装饰隐藏 */
  .fixed.inset-0.overflow-hidden.pointer-events-none {
    display: none;
  }
}

@media (max-width: 480px) {
  /* 超小屏幕优化 */
  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .gap-2 {
    gap: 0.375rem;
  }

  /* 分类按钮进一步优化 */
  .flex-wrap button {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>