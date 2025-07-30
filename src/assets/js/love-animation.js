// 爱心树动画类 - 移动端优化版本
class LoveTreeAnimation {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    // 默认配置
    this.config = {
      heartColor: 'rgb(190, 26, 37)',
      branchColor: '#8B4513',
      leafColor: '#228B22',
      bloomCount: window.innerWidth <= 768 ? 300 : 700, // 移动端减少粒子数
      animationSpeed: window.innerWidth <= 768 ? 20 : 10, // 移动端加快动画
      ...options
    };
    
    this.particles = [];
    this.branches = [];
    this.isAnimating = false;
    this.animationStep = 0;
    
    this.init();
  }
  
  init() {
    this.ctx.fillStyle = this.config.heartColor;
    this.ctx.strokeStyle = this.config.branchColor;
    this.createBranches();
    this.createParticles();
  }
  
  // 创建树枝结构
  createBranches() {
    const centerX = this.width / 2;
    const centerY = this.height;
    
    // 主干
    this.branches.push({
      startX: centerX,
      startY: centerY,
      endX: centerX,
      endY: centerY * 0.3,
      width: 8,
      growth: 0
    });
    
    // 分支
    const branchCount = window.innerWidth <= 768 ? 5 : 8;
    for (let i = 0; i < branchCount; i++) {
      const angle = (Math.PI / branchCount) * i - Math.PI / 2;
      const length = 50 + Math.random() * 100;
      const startY = centerY * (0.4 + Math.random() * 0.4);
      
      this.branches.push({
        startX: centerX + Math.random() * 40 - 20,
        startY: startY,
        endX: centerX + Math.cos(angle) * length,
        endY: startY + Math.sin(angle) * length,
        width: 2 + Math.random() * 3,
        growth: 0
      });
    }
  }
  
  // 创建花瓣粒子
  createParticles() {
    for (let i = 0; i < this.config.bloomCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 3 + 1,
        color: this.getRandomColor(),
        alpha: Math.random() * 0.8 + 0.2,
        life: Math.random() * 100 + 50
      });
    }
  }
  
  // 获取随机颜色
  getRandomColor() {
    const colors = [
      'rgb(255, 182, 193)', // 浅粉色
      'rgb(255, 105, 180)', // 热粉色
      'rgb(255, 20, 147)',  // 深粉色
      'rgb(255, 69, 0)',    // 橙红色
      'rgb(255, 99, 71)'    // 番茄色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // 绘制爱心形状
  drawHeart(x, y, size) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(size, size);
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(-5, -5, -10, -2, -5, 2);
    this.ctx.bezierCurveTo(-5, 5, 0, 8, 0, 10);
    this.ctx.bezierCurveTo(0, 8, 5, 5, 5, 2);
    this.ctx.bezierCurveTo(10, -2, 5, -5, 0, 0);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  // 绘制树枝
  drawBranches() {
    this.ctx.strokeStyle = this.config.branchColor;
    
    this.branches.forEach(branch => {
      if (branch.growth > 0) {
        this.ctx.lineWidth = branch.width;
        this.ctx.beginPath();
        this.ctx.moveTo(branch.startX, branch.startY);
        
        const currentEndX = branch.startX + (branch.endX - branch.startX) * branch.growth;
        const currentEndY = branch.startY + (branch.endY - branch.startY) * branch.growth;
        
        this.ctx.lineTo(currentEndX, currentEndY);
        this.ctx.stroke();
      }
    });
  }
  
  // 绘制粒子
  drawParticles() {
    this.particles.forEach(particle => {
      if (particle.life > 0) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.alpha * (particle.life / 100);
        this.ctx.fillStyle = particle.color;
        
        // 绘制小爱心或圆形
        if (Math.random() > 0.7) {
          this.drawHeart(particle.x, particle.y, particle.size * 0.3);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
        
        this.ctx.restore();
      }
    });
  }
  
  // 更新动画
  update() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // 更新树枝生长
    this.branches.forEach(branch => {
      if (branch.growth < 1) {
        branch.growth += 0.02;
      }
    });
    
    // 更新粒子
    this.particles.forEach(particle => {
      if (particle.life > 0) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // 边界检查
        if (particle.x < 0 || particle.x > this.width) {
          particle.vx *= -0.8;
        }
        if (particle.y > this.height) {
          particle.y = 0;
          particle.x = Math.random() * this.width;
          particle.life = Math.random() * 100 + 50;
        }
      } else {
        // 重置粒子
        particle.x = Math.random() * this.width;
        particle.y = -10;
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = Math.random() * 2 + 1;
        particle.life = Math.random() * 100 + 50;
        particle.color = this.getRandomColor();
      }
    });
    
    // 绘制所有元素
    this.drawBranches();
    this.drawParticles();
    
    // 在中心绘制大爱心
    if (this.animationStep > 100) {
      this.ctx.fillStyle = this.config.heartColor;
      this.drawHeart(this.width / 2, this.height / 2 - 50, 3);
    }
    
    this.animationStep++;
  }
  
  // 开始动画
  start() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    const animate = () => {
      if (this.isAnimating) {
        this.update();
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, this.config.animationSpeed);
      }
    };
    animate();
  }
  
  // 停止动画
  stop() {
    this.isAnimating = false;
  }
  
  // 处理点击事件
  handleClick(x, y) {
    // 在点击位置创建爆炸效果
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 2,
        color: this.getRandomColor(),
        alpha: 1,
        life: 30
      });
    }
  }
  
  // 调整画布大小
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    
    // 重新创建元素
    this.branches = [];
    this.particles = [];
    this.createBranches();
    this.createParticles();
  }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoveTreeAnimation;
} else {
  window.LoveTreeAnimation = LoveTreeAnimation;
}
