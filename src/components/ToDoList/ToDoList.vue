<template>
  <div>
    <div id="pjax-container">
      <div class="central">
        <div class="row central central-800">
          <div v-if="loveEvents.length > 0" class="card col-lg-12 col-md-12 col-sm-12 col-sm-x-12">
            <div :class="['list_texts', { 'animated fadeInUp delay-03s': text.Animation === '1' }]">
              <ul class="lovelist">
                <li v-for="(event, index) in loveEvents" :key="event.id" class="event-item">
                  <div class="event-header" @click="toggleEvent(index)">
                    <i v-if="event.status" class="iconfont icon-chenggong2 com"></i>
                    <i v-else class="iconfont icon-chenggong2 air"></i>
                    <span class="event-title">{{ event.name }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'ToDoList',
  props: {
    text: {
      type: Object,
      default: () => ({ title: '恋爱事件', Animation: '1' })
    }
  },
  setup() {
    // Mock data - replace with actual API call in production
    const loveEvents = ref([
      {
        id: 1,
        name: '一起在厨房做早餐/午餐🍲',
        status: false
      },
      {
        id: 2,
        name: '一起养只可爱的猫猫🐱',
        status: false
      },
      {
        id: 3,
        name: '一起住进自己的大House🏠',
        status: false
      },
      {
        id: 4,
        name: '一起拥有自己的小汽车🚗',
        status: false
      },
      {
        id: 5,
        name: '一起听一场演唱会🎤',
        status: false
      },
      {
        id:7,
        name: '一起去爬山⛰',
        status: false
      },
      {
        id:11,
        name: '一起去游乐园🎡',
        status: false
      },
      {
        id:8,
        name: '一起去旅游📸',
        status: false
      },
      {
        id:12,
        name:'一起看烟花🎆'
      },
      {
        id: 6,
        name: '一起去电影院看电影🎬',
        status: true
      },
      {
        id:9,
        name: '一起赖一次床🛏️',
        status: true
      },
      {
        id:10,
        name: '一起下班后散步',
        status: true
      },
      {
        id:12,
        name: '一起在下雨天追剧📺',
        status: true
      },
      {
        id:13,
        name:'一起做蛋糕甜点🍰'
      },
      {
        id:14,
        name:'一起按摩'
      },
      {
        id:15,
        name:'一起做DIY'
      },
      {
        id:16,
        name:'一起看日出看日落🌅'
      },
      {
        id:17,
        name:''
      }
    ]);

    const expandedEvents = ref({});

    // Initialize expanded state
    const initExpandedEvents = () => {
      expandedEvents.value = loveEvents.value.reduce((acc, _, index) => {
        acc[index] = false;
        return acc;
      }, {});
    };

    // Toggle event visibility
    const toggleEvent = (index) => {
      // Close all other events when opening a new one
      if (!expandedEvents.value[index]) {
        Object.keys(expandedEvents.value).forEach(key => {
          expandedEvents.value[key] = false;
        });
      }
      expandedEvents.value[index] = !expandedEvents.value[index];
    };

    // Format date for display
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('zh-CN', options);
    };

    onMounted(() => {
      initExpandedEvents();
    });

    return {
      loveEvents,
      expandedEvents,
      toggleEvent,
      formatDate
    };
  }
};
</script>

<style scoped>
.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.3em;
  fill: currentColor;
  overflow: hidden;
}

li.cike {
  border-bottom: 1px solid #ddd;
}

li {
  list-style-type: none;
}

</style>