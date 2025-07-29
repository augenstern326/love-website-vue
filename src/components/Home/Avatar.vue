<script setup>
defineProps({
  bgImage: String,
  boy: Object,
  girl: Object,
  animation: Boolean,
  blurEffect: Boolean
})
</script>

<template>
  <div class="bg-wrap">
    <div class="bg-img" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="central central-800">
        <div
            class="middle"
            :class="{
            'animated fadeInDown': animation,
            'Blurkg': blurEffect
          }"
        >
          <div class="img-male">
            <img :src="boy.avatar" draggable="false">
            <span>{{ boy.name }}</span>
          </div>
          <div class="love-icon">
            <img src="../../assets/img/like.svg" draggable="false">
          </div>
          <div class="img-female">
            <img :src="girl.avatar" draggable="false">
            <span>{{ girl.name }}</span>
          </div>
        </div>
      </div>
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none"
           shape-rendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"/>
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)"/>
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)"/>
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)"/>
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.bg-img {
  background-size: cover !important;
  background-position: center !important;
}

.Blurkg {
  backdrop-filter: blur(0px) !important;
  -webkit-backdrop-filter: blur(0px) !important;
  background: transparent !important;
}
</style>