<template>
  <div v-if="isLoading" class="loading-screen">
    <div class="loading-content">
      <!-- 爱心动画 -->
      <div class="heart-animation">
        <div class="heart heart-1">💕</div>
        <div class="heart heart-2">💖</div>
        <div class="heart heart-3">💗</div>
      </div>
      
      <!-- 加载文字 -->
      <div class="loading-text">
        <h2>{{ loadingText }}</h2>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const progress = ref(0)
const loadingText = ref('Loading...')

const loadingTexts = [
  '正在加载美好回忆...',
  '准备浪漫时光...',
  '加载爱的故事...',
  '即将开始甜蜜之旅...'
]

let textIndex = 0
let progressInterval = null
let textInterval = null

onMounted(() => {
  // 进度条动画
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.random() * 15 + 5
      if (progress.value > 100) progress.value = 100
    }
  }, 200)

  // 文字切换
  textInterval = setInterval(() => {
    textIndex = (textIndex + 1) % loadingTexts.length
    loadingText.value = loadingTexts[textIndex]
  }, 1000)

  // 3秒后隐藏加载屏幕
  setTimeout(() => {
    isLoading.value = false
    clearInterval(progressInterval)
    clearInterval(textInterval)
  }, 3000)
})

defineExpose({
  isLoading
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e6fff9, #f0fffc);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: '微软雅黑', sans-serif;
}

.loading-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

/* 爱心动画 */
.heart-animation {
  position: relative;
  height: 100px;
  margin-bottom: 2rem;
}

.heart {
  position: absolute;
  font-size: 2rem;
  animation: float 2s ease-in-out infinite;
}

.heart-1 {
  left: 20%;
  animation-delay: 0s;
}

.heart-2 {
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.5s;
}

.heart-3 {
  right: 20%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px);
    opacity: 1;
  }
}

/* 加载文字 */
.loading-text h2 {
  color: #00d4aa;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 2rem;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #00d4aa;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 进度条 */
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(0, 212, 170, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4aa, #00a085);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .loading-content {
    padding: 1rem;
  }
  
  .loading-text h2 {
    font-size: 1.2rem;
  }
  
  .heart {
    font-size: 1.5rem;
  }
}
</style>
