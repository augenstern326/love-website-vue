<template>
  <div class="fullpage-container">
    <!-- 使用Swiper的Vue组件 -->
<!--    -->
    <swiper
        :direction="'vertical'"
        :slidesPerView="1"
        :speed="800"
        :mousewheel="true"
        :pagination="{ clickable: true }"
        :modules="modules"
        @slideChange="onSlideChange"
        class="fullpage-swiper"
    >
      <!-- 每个swiper-slide包含一个页面组件 -->
      <Header :site-title="siteTitle" :slogan="slogan"/>
      <swiper-slide v-for="(page, index) in pages" :key="index">
        <component :is="page.component" :active="activeIndex === index" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel, Pagination } from 'swiper'

// 导入页面组件

import Page1 from '@/components/Home/Home.vue'
import Page2 from '@/components/ToDoList/ToDoList.vue'
// import Page3 from '@/components/Memory/Memory.vue'

import Header from '@/components/Header.vue'

const siteTitle = ref('H&T的爱情小屋')
const slogan = ref('爱你就像爱生命')

// 必须导入Swiper样式
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Mousewheel, Pagination]
const activeIndex = ref(0)

const pages = [
  { component: Page1 },
  { component: Page2 },
  // { component: Page3 }
]

const onSlideChange = (swiper) => {
  activeIndex.value = swiper.activeIndex
}

</script>

<style scoped>
.fullpage-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.fullpage-swiper {
  height: 100%;
}

.swiper-slide {
  height: 100vh;
  overflow-y: auto; /* 允许页面内容滚动 */
}
</style>