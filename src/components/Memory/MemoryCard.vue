<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  memory: Object,
})

// 检测移动端
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 图片加载错误处理
const handleImageError = (event) => {
  console.warn('图片加载失败:', event.target.src)
  // 设置默认图片
  event.target.src = '/img/memory/default.jpg'
}

// 图片加载成功处理
const handleImageLoad = (event) => {
  event.target.style.opacity = '1'
}

// 阻止事件冒泡，避免与Swiper冲突
const stopPropagation = (e) => {
  e.stopPropagation();
}
</script>

<template>
  <a-card
      hoverable
      class="memory-card"
      @touchstart.stop
      @touchmove.stop
      @wheel.stop
  >
    <template #cover>
      <a-carousel
          arrows
          dots-class="slick-dots slick-thumb"
          class="memory-carousel"
          @touchstart.stop
          @touchmove.stop
          @wheel.stop
      >
        <div
            v-for="imgUrl in memory.images"
            :key="imgUrl"
            class="carousel-item"
            @touchstart.stop
            @touchmove.stop
            @wheel.stop
        >
          <img
              :src="imgUrl"
              :alt="memory.title"
              class="memory-image"
              @error="handleImageError"
              @load="handleImageLoad"
              loading="lazy"
              @touchstart.stop
              @touchmove.stop
              @wheel.stop
          />
        </div>
      </a-carousel>
    </template>
    <a-card-meta class="card-meta">
      <template #title>{{ memory.title }}</template>
      <template #description>
        <div class="memory-info">
          <div class="memory-meta">
            <span class="meta-item">📅 {{ memory.date }}</span>
            <span class="meta-item">📍 {{ memory.location }}</span>
          </div>
          <p class="memory-desc">{{ memory.description }}</p>
          <div class="memory-category">{{ memory.category }}</div>
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<style scoped>
.memory-card {
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;
  touch-action: pan-y; /* 允许垂直平移 */
}

.memory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.memory-carousel {
  height: 250px;
  overflow: hidden;
  background: #f5f5f5;
}

.carousel-item {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.memory-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  background: #f5f5f5;
}

.memory-image:hover {
  transform: scale(1.02);
}

.card-meta {
  padding: 16px;
}

.memory-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.memory-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 14px;
  color: #666;
}

.memory-desc {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.memory-category {
  display: inline-block;
  background: linear-gradient(45deg, #00d4aa, #00a085);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .memory-card {
    width: 100%;
    margin: 0 auto 15px auto;
    border-radius: 12px;
  }

  .memory-carousel {
    height: 200px;
  }

  .carousel-item {
    height: 200px;
  }

  .card-meta {
    padding: 12px;
  }

  .memory-meta {
    gap: 12px;
  }

  .meta-item {
    font-size: 13px;
  }

  .memory-desc {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .memory-card {
    width: 100%;
    margin-bottom: 12px;
  }

  .memory-carousel {
    height: 180px;
  }

  .carousel-item {
    height: 180px;
  }

  .card-meta {
    padding: 10px;
  }

  .meta-item {
    font-size: 12px;
  }

  .memory-desc {
    font-size: 12px;
  }

  :deep(.ant-card-meta-title) {
    font-size: 16px;
  }
}

/* Ant Design 组件样式覆盖 */
:deep(.ant-card-body) {
  padding: 0;
}

:deep(.ant-card-meta-title) {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

:deep(.ant-card-meta-description) {
  color: inherit;
}

:deep(.slick-dots) {
  bottom: 12px;
}

:deep(.slick-dots li button) {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

:deep(.slick-dots li.slick-active button) {
  background: white;
}

/* 轮播箭头样式优化 */
:deep(.slick-prev),
:deep(.slick-next) {
  z-index: 2;
}

:deep(.slick-prev:before),
:deep(.slick-next:before) {
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
}

@media (max-width: 480px) {
  :deep(.slick-prev),
  :deep(.slick-next) {
    display: none !important;
  }
}
</style>