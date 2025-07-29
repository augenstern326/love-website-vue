<!-- MemoryCard.vue -->
<template>
  <div
      class="group relative bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 touch-manipulation"
      :style="cardStyle"
      @mouseenter="showDetails = true"
      @mouseleave="showDetails = false"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
  >
    <!-- 图片容器 -->
    <div class="relative h-48 sm:h-56 md:h-64 overflow-hidden">
      <!-- 图片加载骨架屏 -->
      <div
          v-if="!isImageLoaded && !isImageFailed"
          class="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 animate-pulse flex items-center justify-center"
      >
        <ImageIcon class="w-12 h-12 text-pink-300" />
      </div>

      <!-- 图片加载失败占位 -->
      <div
          v-if="isImageFailed"
          class="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 flex flex-col items-center justify-center"
      >
        <ImageIcon class="w-12 h-12 text-pink-400 mb-2" />
        <span class="text-sm text-pink-600">图片加载失败</span>
      </div>

      <!-- 实际图片 -->
      <img
          v-if="isImageLoaded"
          :src="currentImage"
          :alt="memory.title"
          class="w-full h-full object-cover"
          :style="imageStyle"
          @error="handleImageError"
      />

      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <!-- 多图片导航按钮 -->
      <template v-if="hasMultipleImages && isImageLoaded">
        <button
            class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all duration-200 touch-manipulation"
            @click="prevImage"
            @touchstart.prevent="prevImage"
            :style="navButtonStyle('left')"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all duration-200 touch-manipulation"
            @click="nextImage"
            @touchstart.prevent="nextImage"
            :style="navButtonStyle('right')"
        >
          <ChevronRight class="w-4 h-4" />
        </button>

        <!-- 图片指示器 -->
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          <button
              v-for="(_, idx) in memory.images"
              :key="idx"
              class="w-2 h-2 rounded-full transition-all duration-200 touch-manipulation"
              :class="{
              'bg-white': idx === currentImageIndex,
              'bg-white/50': idx !== currentImageIndex
            }"
              @click="setCurrentImageIndex(idx)"
              @touchstart.prevent="setCurrentImageIndex(idx)"
          />
        </div>
      </template>

      <!-- 图片数量标识 -->
      <div
          v-if="hasMultipleImages"
          class="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs flex items-center space-x-1"
      >
        <Camera class="w-3 h-3" />
        <span>{{ memory.images.length }}</span>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="p-3 sm:p-4">
      <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2" :style="titleStyle">
        {{ memory.title }}
      </h3>

      <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-600 mb-3" :style="metaStyle">
        <div class="flex items-center space-x-1">
          <Calendar class="w-4 h-4 text-pink-500" />
          <span>{{ memory.date }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <MapPin class="w-4 h-4 text-purple-500" />
          <span>{{ memory.location }}</span>
        </div>
      </div>

      <transition name="details">
        <div v-if="showDetails || isMobile" class="overflow-hidden">
          <p class="text-gray-700 text-sm leading-relaxed mb-3">
            {{ memory.description }}
          </p>
          <div class="flex items-center justify-between">
            <span
                class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium"
                :style="categoryStyle"
            >
              {{ memory.category }}
            </span>
            <span
                v-if="hasMultipleImages"
                class="text-xs text-gray-500 flex items-center space-x-1"
            >
              <Camera class="w-3 h-3" />
              <span>{{ currentImageIndex + 1 }}/{{ memory.images.length }}</span>
            </span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, MapPin, Calendar, Camera, Image as ImageIcon } from 'lucide-vue-next'

export default {
  components: {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Calendar,
    Camera,
    ImageIcon
  },
  props: {
    memory: Object,
    index: Number,
    loadedImages: Set,
    failedImages: Set
  },
  setup(props) {
    const currentImageIndex = ref(0)
    const showDetails = ref(false)
    const imageError = ref(false)
    const isMobile = ref(false)
    const touchStartTime = ref(0)

    const currentImage = computed(() => props.memory.images[currentImageIndex.value])
    const hasMultipleImages = computed(() => props.memory.images.length > 1)
    const isImageLoaded = computed(() => props.loadedImages.has(currentImage.value))
    const isImageFailed = computed(() => props.failedImages.has(currentImage.value) || imageError.value)

    const nextImage = () => {
      if (hasMultipleImages.value) {
        currentImageIndex.value = (currentImageIndex.value + 1) % props.memory.images.length
      }
    }

    const prevImage = () => {
      if (hasMultipleImages.value) {
        currentImageIndex.value = (currentImageIndex.value - 1 + props.memory.images.length) % props.memory.images.length
      }
    }

    const setCurrentImageIndex = (index) => {
      currentImageIndex.value = index
    }

    const handleImageError = () => {
      imageError.value = true
    }

    // 移动端检测和触摸处理
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768 || 'ontouchstart' in window
    }

    const handleTouchStart = () => {
      touchStartTime.value = Date.now()
      if (isMobile.value) {
        showDetails.value = true
      }
    }

    const handleTouchEnd = () => {
      const touchDuration = Date.now() - touchStartTime.value
      if (touchDuration > 300 && isMobile.value) {
        // 长按保持显示详情
        return
      }
      // 短按切换详情显示
      if (isMobile.value && touchDuration < 300) {
        showDetails.value = !showDetails.value
      }
    }

    // 监听窗口大小变化
    const handleResize = () => {
      checkMobile()
    }

    // 组件挂载时检测移动端
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', handleResize)
    })

    // 组件卸载时清理事件监听
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    // 动画样式
    const cardStyle = reactive({
      opacity: 0,
      transform: 'translateY(50px)',
      animation: `slideUp 0.6s ${props.index * 0.1}s forwards`
    })

    const imageStyle = reactive({
      opacity: 0,
      transform: 'scale(1.1)',
      animation: 'fadeScaleIn 0.5s forwards'
    })

    const titleStyle = reactive({
      opacity: 0,
      animation: 'fadeIn 0.5s 0.2s forwards'
    })

    const metaStyle = reactive({
      opacity: 0,
      animation: 'fadeIn 0.5s 0.3s forwards'
    })

    const categoryStyle = {
      '--hover-scale': 1.05
    }

    const navButtonStyle = (position) => {
      return {
        opacity: showDetails.value ? 1 : 0,
        transition: 'opacity 0.3s',
        [position === 'left' ? 'left' : 'right']: '0.5rem'
      }
    }

    return {
      currentImageIndex,
      showDetails,
      currentImage,
      hasMultipleImages,
      isImageLoaded,
      isImageFailed,
      isMobile,
      nextImage,
      prevImage,
      setCurrentImageIndex,
      handleImageError,
      handleTouchStart,
      handleTouchEnd,
      cardStyle,
      imageStyle,
      titleStyle,
      metaStyle,
      categoryStyle,
      navButtonStyle
    }
  }
}
</script>

<style scoped>
@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeScaleIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.details-enter-active, .details-leave-active {
  transition: all 0.3s;
  max-height: 200px;
}

.details-enter-from, .details-leave-to {
  opacity: 0;
  max-height: 0;
}

.group:hover {
  transform: translateY(-8px) scale(1.02);
}

.category-style {
  transition: transform 0.2s;
}

.category-style:hover {
  transform: scale(var(--hover-scale));
}

/* 移动端优化 */
@media (max-width: 768px) {
  .group:hover .group-hover\:shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  /* 移动端触摸优化 */
  .touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  /* 移动端按钮大小优化 */
  .group button {
    min-height: 44px;
    min-width: 44px;
  }

  /* 移动端卡片间距优化 */
  .group {
    margin-bottom: 1rem;
  }

  /* 移动端详情默认显示 */
  .details-enter-active, .details-leave-active {
    transition: all 0.2s;
  }
}
</style>