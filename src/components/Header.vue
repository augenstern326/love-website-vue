<script setup>
  defineProps({
    siteTitle: String,
    slogan: String
  })
</script>

<template>
  <div class="header-wrap">
    <div class="header">
      <div class="logo">
        <h1><a class="alogo" href="/">{{ siteTitle }}</a></h1>
      </div>
      <div class="word">
        <span class="wenan">{{ slogan }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

.wenan {
  color: rgb(97 97 97);
  transition: all 0.2s linear;
}

.alogo {
  color: rgb(97 97 97);
  transition: all 0.2s linear;
}

/* webkit, opera, IE9 （谷歌浏览器）*/
::selection {
  background: #6f6f6fc7;
  color: #ffffff;
}

/* mozilla firefox（火狐浏览器） */
::-moz-selection {
  background: #6f6f6fc7;
  color: #ffffff;
}

</style>