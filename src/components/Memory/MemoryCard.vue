<script setup>
import { computed } from 'vue'

defineProps({
  key: String,
  memory: Object,
})

// 检测移动端
const isMobile = computed(() => window.innerWidth <= 768)
</script>

<template>
  <a-card hoverable class="memory-card">
    <template #cover>
      <a-carousel arrows dots-class="slick-dots slick-thumb" class="memory-carousel">
        <div v-for="imgUrl in memory.images" :key="imgUrl" class="carousel-item">
          <img :src="imgUrl" :alt="memory.title" class="memory-image" />
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
}

.memory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.memory-carousel {
  height: 250px;
  overflow: hidden;
}

.carousel-item {
  height: 250px;
}

.memory-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.memory-image:hover {
  transform: scale(1.05);
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
    width: 80vw;
    margin: 0 auto 20px auto;
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
    width: 85vw;
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
</style>