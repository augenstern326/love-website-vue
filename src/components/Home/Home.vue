<script setup>
import { ref } from 'vue'
import Avatar from "@/components/Home/Avatar.vue";
import CountUpTimer from "@/components/Home/CountUpTimer.vue";


const bgImage = ref(new URL('@/assets/img/bg.webp', import.meta.url).href)
const startDate = ref('2025-06-06 20:00:00')

const boyData = ref({
  name: 'Hu',
  avatar: new URL('@/assets/img/avatar/avatar1.jpg', import.meta.url).href
})

const girlData = ref({
  name: 'Tang',
  avatar: new URL('@/assets/img/avatar/avatar2.jpg', import.meta.url).href
})
const animationEnabled = ref(true)
const blurEnabled = ref(false)

</script>
<template>
  <div id="Home">
    <Avatar
        :bg-image="bgImage"
        :boy="boyData"
        :girl="girlData"
        :animation="animationEnabled"
        :blur-effect="blurEnabled"
    />
    <CountUpTimer :start-date="startDate"/>
  </div>
</template>
<style scoped>
/* 全局样式 */
::selection {
  background: #6f6f6fc7;
  color: #ffffff;
}

::-moz-selection {
  background: #6f6f6fc7;
  color: #ffffff;
}

</style>