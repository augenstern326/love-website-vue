<template>
  <div class="love-tree-container">
    <!-- 错误提示 -->
    <div class="error-message" v-show="showError">
      抱歉，您的浏览器不支持Canvas，请使用现代浏览器访问。
    </div>

    <!-- 主内容区域 -->
    <div class="main-content" v-show="!showError">
      <!-- 文字内容 -->
      <div class="text-content">
        <div class="love-text" :class="{ show: showText }" ref="textElement">
          <span class="say">亲爱的糖宝</span>
          <span class="say">&nbsp;</span>
          <span class="say">花开一季，有落红为证</span>
          <span class="say">&nbsp;</span>
          <span class="say">逝去的岁月，如何能托于烟尘</span>
          <span class="say">&nbsp;</span>
          <span class="say">你的浅笑，是我永生眷恋</span>
          <span class="say">&nbsp;</span>
          <span class="say">相思的真情，是否能明白一二</span>
          <span class="say">&nbsp;</span>
          <span class="say">亲爱的宝贝，你是我的唯一</span>
          <span class="say">&nbsp;</span>
          <span class="say">爱你永远。。。</span>
          <span class="say">&nbsp;</span>
          <span class="say"><span class="space"></span> --爱你的小胡--</span>
        </div>
      </div>

      <!-- 时间显示 -->
      <div class="clock-box" :class="{ show: showClock }">
        小胡<span style="color: #666666">与</span> 糖宝<span style="color: #666666">已经相恋了</span>
        <div class="clock" v-html="timeDisplay"></div>
      </div>

      <!-- Canvas画布 -->
      <div class="canvas-container">
        <canvas
            id="love-canvas"
            ref="canvas"
            @click="handleCanvasClick"
            @touchstart="handleCanvasTouch"
            :class="{ hand: showHand }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// 响应式数据
const showError = ref(false)
const showText = ref(false)
const showClock = ref(false)
const showHand = ref(false)
const timeDisplay = ref('')

// DOM引用
const canvas = ref(null)
const textElement = ref(null)

// 动画相关变量
let loveAnimation = null
let timeInterval = null

// 相恋开始时间 (2025年6月6日)
const loveStartDate = new Date(2025, 5, 6, 20, 0, 0, 0)

// 检查Canvas支持
const checkCanvasSupport = () => {
  const testCanvas = document.createElement('canvas')
  return !!(testCanvas.getContext && testCanvas.getContext('2d'))
}

// 简单的爱心树动画类
class LoveTreeAnimation {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.options = {
      heartColor: options.heartColor || 'rgb(255, 107, 157)',
      bloomCount: options.bloomCount || 300,
      animationSpeed: options.animationSpeed || 20,
      ...options
    }
    this.hearts = []
    this.animationId = null
    this.isRunning = false
  }

  start() {
    if (this.isRunning) return
    this.isRunning = true
    this.generateHearts()
    this.animate()
  }

  stop() {
    this.isRunning = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  generateHearts() {
    this.hearts = []
    for (let i = 0; i < this.options.bloomCount; i++) {
      this.hearts.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 2 + 0.5,
        angle: Math.random() * Math.PI * 2
      })
    }
  }

  drawHeart(x, y, size) {
    this.ctx.save()
    this.ctx.translate(x, y)
    this.ctx.scale(size, size)
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.bezierCurveTo(-5, -5, -10, 0, 0, 10)
    this.ctx.bezierCurveTo(10, 0, 5, -5, 0, 0)
    this.ctx.fillStyle = this.options.heartColor
    this.ctx.fill()
    this.ctx.restore()
  }

  animate() {
    if (!this.isRunning) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // 绘制背景渐变
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
    gradient.addColorStop(0, '#e6fff9')
    gradient.addColorStop(1, '#f0fffc')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制爱心
    this.hearts.forEach(heart => {
      this.ctx.globalAlpha = heart.opacity
      this.drawHeart(heart.x, heart.y, heart.size)
      
      // 更新位置
      heart.y -= heart.speed
      heart.x += Math.sin(heart.angle) * 0.5
      heart.angle += 0.02
      
      // 重置位置
      if (heart.y < -20) {
        heart.y = this.canvas.height + 20
        heart.x = Math.random() * this.canvas.width
      }
    })

    this.ctx.globalAlpha = 1
    this.animationId = requestAnimationFrame(() => this.animate())
  }

  handleClick(x, y) {
    // 在点击位置添加爆炸效果
    for (let i = 0; i < 10; i++) {
      this.hearts.push({
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        size: Math.random() * 2 + 1,
        opacity: 1,
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2
      })
    }
  }

  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'
    this.generateHearts()
  }
}

// 初始化Canvas
const initCanvas = () => {
  if (!canvas.value || !checkCanvasSupport()) {
    showError.value = true
    return false
  }

  const canvasEl = canvas.value
  const container = canvasEl.parentElement
  
  if (!container) {
    console.error('Canvas container not found')
    showError.value = true
    return false
  }

  const containerRect = container.getBoundingClientRect()

  // 响应式Canvas尺寸 - 缩小整体尺寸
  const isMobile = window.innerWidth <= 768
  const canvasWidth = isMobile ? Math.min(350, containerRect.width - 20) : Math.min(600, containerRect.width - 40)
  const canvasHeight = isMobile ? Math.min(400, containerRect.height - 20) : Math.min(450, containerRect.height - 40)

  canvasEl.width = canvasWidth
  canvasEl.height = canvasHeight
  canvasEl.style.width = canvasWidth + 'px'
  canvasEl.style.height = canvasHeight + 'px'

  // 初始化爱心树动画 - 减少爱心数量
  try {
    loveAnimation = new LoveTreeAnimation(canvasEl, {
      heartColor: 'rgb(255, 107, 157)',
      bloomCount: isMobile ? 80 : 120,
      animationSpeed: isMobile ? 30 : 20
    })
  } catch (error) {
    console.error('Failed to initialize love animation:', error)
    showError.value = true
    return false
  }

  return { width: canvasWidth, height: canvasHeight }
}

// 文字打字机效果
const typewriterEffect = async () => {
  if (!textElement.value) return

  showText.value = true
  await nextTick()

  const element = textElement.value
  const originalHTML = element.innerHTML
  element.innerHTML = ''

  let progress = 0
  const typeInterval = setInterval(() => {
    let current = originalHTML.substring(progress, progress + 1)
    if (current === '<') {
      progress = originalHTML.indexOf('>', progress) + 1
    } else {
      progress++
    }

    element.innerHTML = originalHTML.substring(0, progress) +
        (progress & 1 ? '<span class="typewriter-cursor">_</span>' : '')

    if (progress >= originalHTML.length) {
      clearInterval(typeInterval)
      element.innerHTML = originalHTML
    }
  }, 75)
}

// 时间计算
const updateTimeDisplay = () => {
  const now = new Date()
  const timeDiff = now.getTime() - loveStartDate.getTime()
  const seconds = Math.floor(timeDiff / 1000)

  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const formatTime = (num) => num.toString().padStart(2, '0')

  timeDisplay.value = `第 <span class="digit">${days}</span> 天 <span class="digit">${formatTime(hours)}</span> 小时 <span class="digit">${formatTime(minutes)}</span> 分钟 <span class="digit">${formatTime(secs)}</span> 秒`
}

// Canvas点击处理
const handleCanvasClick = (event) => {
  if (!loveAnimation) return

  const rect = canvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 在点击位置创建爱心爆炸效果
  loveAnimation.handleClick(x, y)
}

// 移动端触摸处理
const handleCanvasTouch = (event) => {
  event.preventDefault()
  const touch = event.touches[0]
  const rect = canvas.value.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top

  // 触摸位置创建爱心效果
  if (loveAnimation) {
    loveAnimation.handleClick(x, y)
  }
}

// 窗口大小变化处理
const handleResize = () => {
  if (canvas.value && loveAnimation) {
    try {
      const canvasEl = canvas.value
      const container = canvasEl.parentElement

      if (!container) return

      const containerRect = container.getBoundingClientRect()

      const isMobile = window.innerWidth <= 768
      const canvasWidth = isMobile ? Math.min(350, containerRect.width - 20) : Math.min(600, containerRect.width - 40)
      const canvasHeight = isMobile ? Math.min(400, containerRect.height - 20) : Math.min(450, containerRect.height - 40)

      // 调整动画尺寸
      loveAnimation.resize(canvasWidth, canvasHeight)
    } catch (error) {
      console.error('Error during resize:', error)
    }
  }
}

// 组件挂载
onMounted(async () => {
  try {
    // 等待DOM完全渲染
    await nextTick()

    // 初始化Canvas
    const canvasSize = initCanvas()
    if (!canvasSize) return

    // 延迟启动动画序列
    setTimeout(async () => {
      try {
        // 启动Canvas动画
        if (loveAnimation) {
          loveAnimation.start()
        }

        // 开始文字动画
        await typewriterEffect()

        // 显示时钟
        showClock.value = true

        // 开始时间更新
        updateTimeDisplay()
        timeInterval = setInterval(updateTimeDisplay, 1000)
      } catch (error) {
        console.error('Error during animation initialization:', error)
      }
    }, 1000)

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('Error during component mounting:', error)
    showError.value = true
  }
})

// 组件卸载
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  if (loveAnimation) {
    loveAnimation.stop()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.love-tree-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: linear-gradient(135deg, #e6fff9, #f0fffc);
  font-family: '微软雅黑', '宋体', sans-serif;
  color: #231F20;
  overflow-x: hidden;
}

.main-content {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 450px;
  min-height: 350px;
  margin: 0 auto;
  background: transparent;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.text-content {
  position: absolute;
  left: 20px;
  top: 20px;
  width: calc(50% - 30px);
  height: auto;
  z-index: 10;
}

.love-text {
  font-size: 14px;
  line-height: 1.6;
  display: none;
  color: #333;
}

.love-text.show {
  display: block;
}

.say {
  margin-left: 5px;
  display: block;
  margin-bottom: 6px;
}

.space {
  margin-right: 80px;
}

.clock-box {
  position: absolute;
  left: 20px;
  bottom: 20px;
  font-size: 16px;
  display: none;
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.clock-box.show {
  display: block;
}

.clock {
  margin-left: 0;
  margin-top: 8px;
  text-align: center;
}

.digit {
  font-size: 24px;
  color: #00d4aa;
  font-weight: bold;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
}

#love-canvas {
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 15px;
}

.hand {
  cursor: pointer;
}

.error-message {
  text-align: center;
  margin-top: 60px;
  color: #00a085;
  font-size: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.typewriter-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .love-tree-container {
    padding: 5px;
    min-height: 100vh;
  }

  .main-content {
    width: 100%;
    max-width: 350px;
    height: 400px;
    min-height: 300px;
  }

  .text-content {
    left: 15px;
    top: 15px;
    width: calc(60% - 20px);
  }

  .love-text {
    font-size: 12px;
    line-height: 1.4;
  }

  .clock-box {
    left: 15px;
    bottom: 15px;
    font-size: 14px;
    padding: 8px;
  }

  .digit {
    font-size: 18px;
  }

  .space {
    margin-right: 40px;
  }
}

@media screen and (max-width: 480px) {
  .main-content {
    max-width: 320px;
    height: 350px;
  }

  .love-text {
    font-size: 11px;
  }

  .clock-box {
    font-size: 12px;
    padding: 6px;
  }

  .digit {
    font-size: 16px;
  }

  .space {
    margin-right: 20px;
  }
}

/* 横屏适配 */
@media screen and (max-height: 500px) and (orientation: landscape) {
  .love-tree-container {
    padding: 5px;
  }

  .main-content {
    height: 90vh;
    max-height: 400px;
  }

  .text-content {
    top: 10px;
  }

  .clock-box {
    bottom: 10px;
    font-size: 12px;
  }

  .digit {
    font-size: 16px;
  }
}
</style>
