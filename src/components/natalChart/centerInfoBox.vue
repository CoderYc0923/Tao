<script setup lang="ts">
const props = defineProps({
  name: String,
  lunarDate: String,
  numTime: String,
  wuxingGame: Object,
  personInfo: Object
})

const lunar = computed(() => {
  const { lYear, IMonthCn, IDayCn } = props.personInfo.lunarInfo
  return `${lYear}年${IMonthCn}${IDayCn} ${props.personInfo.shichen}时`
})

</script>

<template>
  <div class="center-cell">
    <div class="cell-item">
      {{ name }}
    </div>
    <div class="cell-item">
      {{ lunar }}
    </div>
    <div class="cell-item">
      {{ wuxingGame.name }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.center-cell {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  .cell-item {
    text-align: center;
  }
}
</style>
