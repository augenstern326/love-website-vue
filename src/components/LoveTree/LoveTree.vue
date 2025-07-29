<template>
  <div id="main">
    <div id="error">本页面采用HTML5编辑，目前您的浏览器无法显示，请换成谷歌(<a href="http://www.google.cn/chrome/intl/zh-CN/landing_chrome.html?hl=zh-CN&brand=CHMI">Chrome</a>)或者火狐(<a href="http://firefox.com.cn/download/">Firefox</a>)浏览器，或者其他游览器的最新版本。</div>
    <div id="wrap">
      <div id="text">
        <div id="code">
          <span class="say">亲爱的糖糖</span><br>
          <span class="say"> </span><br>
          <span class="say">花开一季，有落红为证</span><br>
          <span class="say"> </span><br>
          <span class="say">逝去的岁月，如何能托于烟尘</span><br>
          <span class="say"> </span><br>
          <span class="say">你的浅笑，是我永生眷恋</span><br>
          <span class="say"> </span><br>
          <span class="say">相思的真情，是否能明白一二</span><br>
          <span class="say"> </span><br>
          <span class="say">亲爱的宝贝，你是我的唯一</span><br>
          <span class="say"> </span><br>
          <span class="say">爱你永远。。。</span><br>
          <span class="say"> </span><br>
          <span class="say"><span class="space"></span> --爱你的小胡--</span>
        </div>
      </div>
      <div id="clock-box">
        Hu<span class="STYLE1">与</span> Tang<span class="STYLE1">已经相恋了</span>
        <div id="clock"></div>
      </div>
      <canvas id="canvas" width="1100" height="680"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'LoveTree',
  setup() {

  }
};
</script>

<style scoped>
@import "@/assets/tree/default.css";
</style>