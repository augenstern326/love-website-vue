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
        <h1><a class="alogo" href="/public">{{ siteTitle }}</a></h1>
      </div>
      <div class="word">
        <span class="wenan elegant-slogan">{{ slogan }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wenan {
  color: rgb(97 97 97);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.elegant-slogan {
  font-family: 'Aa百物语';
  font-size: 5rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  line-height: 1.6;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #9b59b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
  text-shadow: none;
}

.elegant-slogan::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #9b59b6 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  border-radius: 4px;
  filter: blur(8px);
}

.elegant-slogan:hover::before {
  opacity: 0.1;
}

.elegant-slogan:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

/* 添加优雅的动画效果 */
@keyframes textShimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.elegant-slogan {
  background-size: 200% auto;
  animation: textShimmer 3s linear infinite;
}

.alogo {
  color: #00d4aa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: '龚帆乐淘体', serif;
  font-weight: 600;
}

.alogo:hover {
  color: #ff6b9d;
  transform: translateY(-1px);
  text-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

/* webkit, opera, IE9 （谷歌浏览器）*/
::selection {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
  color: #ffffff;
}

/* mozilla firefox（火狐浏览器） */
::-moz-selection {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
  color: #ffffff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .elegant-slogan {
    font-size: 1rem;
    letter-spacing: 0.3px;
  }
}

@media (max-width: 480px) {
  .elegant-slogan {
    font-size: 0.9rem;
    letter-spacing: 0.2px;
  }
}

/* 为不支持background-clip的浏览器提供回退 */
@supports not (-webkit-background-clip: text) {
  .elegant-slogan {
    color: #c44569;
    -webkit-text-fill-color: unset;
  }
}
</style>