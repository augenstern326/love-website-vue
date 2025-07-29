<template>
  <div class="time">
    <span id="span_dt_dt">这是我们一起走过的</span>
    <b id="tian">{{ days }}天</b>
    <b id="shi">{{ hours }}时</b>
    <b id="fen">{{ minutes }}分</b>
    <b id="miao">{{ seconds }}秒</b>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  startDate: String
})

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref('00')

onMounted(() => {
  updateTimer()
  setInterval(updateTimer, 1000)
})

function updateTimer() {
  const BirthDay = new Date(props.startDate)
  const today = new Date()
  const timeold = today.getTime() - BirthDay.getTime()
  const sectimeold = timeold / 1000
  const secondsold = Math.floor(sectimeold)
  const msPerDay = 24 * 60 * 60 * 1000
  const e_daysold = timeold / msPerDay
  const e_hrsold = (e_daysold - Math.floor(e_daysold)) * 24
  const e_minsold = (e_hrsold - Math.floor(e_hrsold)) * 60

  days.value = Math.floor(e_daysold)
  hours.value = Math.floor(e_hrsold)
  minutes.value = Math.floor(e_minsold)

  let secs = Math.floor((e_minsold - minutes.value) * 60)
  seconds.value = secs < 10 ? `0${secs}` : secs
}
</script>