<template>
  <div class="fullpage-container">
    <!-- 页面切换动画容器 -->
    <div class="page-transition-container">
      <!-- 使用Swiper的Vue组件 -->


      <swiper
          ref="swiperRef"
          :direction="'vertical'"
          :slidesPerView="1"
          :speed="800"
          :mousewheel="{
            releaseOnEdges: true,
            sensitivity: 1,
            thresholdDelta: 30
          }"
          :pagination="false"
          :modules="modules"
          @slideChange="onSlideChange"
          @slideChangeTransitionStart="onSlideChangeStart"
          @slideChangeTransitionEnd="onSlideChangeEnd"
          class="fullpage-swiper"
          :allowTouchMove="!isTransitioning"
      >
        <!-- 每个swiper-slide包含一个页面组件 -->
        <Header :site-title="siteTitle" :slogan="slogan"/>
        <swiper-slide
          v-for="(page, index) in pages"
          :key="index"
          class="page-slide"
          :class="{ 'slide-active': activeIndex === index }"
        >


          <!-- 页面背景 -->
          <div class="page-background">
            <div class="bg-gradient" :class="`bg-gradient-${index}`"></div>
          </div>

          <!-- 页面内容 -->
          <div
            v-motion
            :initial="{
              opacity: 0,
              y: 30
            }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 600,
                ease: 'easeOut',
                delay: activeIndex === index ? 100 : 0
              }
            }"
            :leave="{
              opacity: 0,
              y: -20,
              transition: {
                duration: 400,
                ease: 'easeIn'
              }
            }"
            class="page-content"
            :class="{ 'content-active': activeIndex === index }"
          >
            <component
              :is="page.component"
              :active="activeIndex === index"
              :key="`${page.name}-${activeIndex === index}`"
            />
          </div>
        </swiper-slide>
      </swiper>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel } from 'swiper'
import { useMotion } from '@vueuse/motion'

// 导入页面组件
import Page1 from '@/components/Home/Home.vue'
import Page2 from '@/components/ToDoList/ToDoList.vue'
import Page3 from '@/components/Memory/Memory.vue'

import Header from '@/components/Header.vue'

const siteTitle = ref('H&T的爱情小屋')
const slogan = ref('爱你就像爱生命')

// 必须导入Swiper样式
import 'swiper/css'

const modules = [Mousewheel]
const activeIndex = ref(0)
const isTransitioning = ref(false)

const pages = [
  { component: Page1, name: 'Home' },
  { component: Page2, name: 'TodoList' },
  { component: Page3, name: 'Memory' }
]

// Swiper实例引用
const swiperRef = ref(null)

const onSlideChange = (swiper) => {
  activeIndex.value = swiper.activeIndex
}

const onSlideChangeStart = () => {
  isTransitioning.value = true
}

const onSlideChangeEnd = () => {
  setTimeout(() => {
    isTransitioning.value = false
  }, 100)
}

const goToSlide = (index) => {
  if (swiperRef.value && !isTransitioning.value) {
    swiperRef.value.slideTo(index)
  }
}



onMounted(() => {
  // 初始化动画
  console.log('Index页面已加载')
})

</script>

<style scoped>
.fullpage-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.page-transition-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.fullpage-swiper {
  height: 100%;
  position: relative;
}



/* 页面样式 */
.page-slide {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.page-slide.slide-active {
  z-index: 10;
}

.page-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  transition: opacity 0.5s ease;
}

.bg-gradient-0 {
  background: linear-gradient(135deg, #ffeef8 0%, #f0e6ff 100%);
}

.bg-gradient-1 {
  background: linear-gradient(135deg, #e6f3ff 0%, #ffeef8 100%);
}

.bg-gradient-2 {
  background: linear-gradient(135deg, #f0e6ff 0%, #e6f3ff 100%);
}

.page-content {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  transition: all 0.4s ease-out;
}

.page-content.content-active {
  transform: translateY(0);
}

/* Swiper 滑动效果优化 */
:deep(.swiper-slide) {
  transition: transform 0.6s ease-out;
}

:deep(.swiper-slide-active) {
  z-index: 2;
}

:deep(.swiper-slide-prev),
:deep(.swiper-slide-next) {
  z-index: 1;
}



/* 页面切换动画增强 */
:deep(.swiper-slide-active) {
  z-index: 2;
}

:deep(.swiper-slide-prev),
:deep(.swiper-slide-next) {
  z-index: 1;
}



/* 页面切换动画 */
@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOutToTop {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.page-content {
  animation: slideInFromBottom 0.5s ease-out forwards;
}



/* 滚动条美化 */
.page-slide::-webkit-scrollbar {
  width: 6px;
}

.page-slide::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.page-slide::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
  border-radius: 3px;
}

.page-slide::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #ff5a8a, #b8456b);
}
</style>