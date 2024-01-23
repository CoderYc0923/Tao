<script setup lang="ts">
import Person from '@/utils/hooks/usePerson'
import palaceCell from './palaceCell.vue';
import centerCell from './centerCell.vue';
import centerInfoBox from './centerInfoBox.vue';

const props = defineProps<{
  result: any
}>()

const currentRes = ref<any>()
const person = ref<Person>()
const natalChart = ref<any>([])
const natalChartRef = ref()
const activeDzs = ref<number[]>([])

const pRefs = reactive({})

provide('pRefs', {
  pRefs,
  addRef(dz, r) {
    pRefs[dz] = r
  }
})

const drawSanFangSiZheng = (palaceIndex: number) => {
  const startDz = person.value.getPalace(palaceIndex)?.dizhiCode
  const leftDz = person.value.getPalace(palaceIndex - 4)?.dizhiCode
  const rightDz = person.value.getPalace(palaceIndex + 4)?.dizhiCode
  const faceDz = person.value.getPalace(palaceIndex + 6)?.dizhiCode
  activeDzs.value = [startDz, leftDz, rightDz, faceDz]

  const startPoint = getPoint(startDz)
  const leftPoint = getPoint(leftDz)
  const rightPoint = getPoint(rightDz)
  const facePoint = getPoint(faceDz)
  draw(startPoint, leftPoint, rightPoint, facePoint)
}

const getPoint = (dz: string) => {
  const width = natalChartRef?.value.clientWidth / 2
  const height = natalChartRef?.value.clientHeight / 2
  const point = { x: 0, y: 0 }
  switch (dz) {
    case 'si':
      point.x = 0
      point.y = 0
      break;
    case 'wu':
      point.x = width / 4
      point.y = 0
      break;
    case 'wei':
      point.x = width / 4 * 3
      point.y = 0
      break;
    case 'shen':
      point.x = width
      point.y = 0
      break;
    case 'chen':
      point.x = 0
      point.y = height / 4
      break;
    case 'mao':
      point.x = 0
      point.y = height / 4 * 3
      break;
    case 'you':
      point.x = width
      point.y = height / 4
      break;
    case 'xu':
      point.x = width
      point.y = height / 4 * 3
      break;
    case 'yin':
      point.x = 0
      point.y = height
      break;
    case 'chou':
      point.x = width / 4
      point.y = height
      break;
    case 'zi':
      point.x = width / 4 * 3
      point.y = height
      break;
    case 'hai':
      point.x = width
      point.y = height
      break;

    default:
      break;
  }
  return point
}

const draw = (sp: any, lp: any, rp: any, fp: any) => {
  const canvas: any = document.getElementById('sanfang')
  if (!canvas.getContext) return
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = 'red'
  ctx.setLineDash([5, 10])
  ctx.beginPath()
  ctx.moveTo(sp.x, sp.y)
  ctx.lineTo(lp.x, lp.y)
  ctx.lineTo(rp.x, rp.y)
  ctx.closePath()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(sp.x, sp.y)
  ctx.lineTo(fp.x, fp.y)
  ctx.closePath()
  ctx.stroke()
}

const onClickPalaceCell = (index) => {
  drawSanFangSiZheng(index)
}

watch(
  () => props.result,
  (res) => {
    if (!res) return
    currentRes.value = res
    person.value = new Person(res)
    natalChart.value = person.value.natalChart
    nextTick(() => drawSanFangSiZheng(person.value.fatePalaceIndex))
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="natal-chart" ref="natalChartRef">
    <template v-for="palace in natalChart" :key="palace.code">
      <palaceCell v-bind="palace" @click="onClickPalaceCell(palace.index)" :class="{'active-cell': activeDzs.includes(palace.dizhiCode)}"></palaceCell>
      <centerCell v-if="palace.dizhiCode == 'chen'"></centerCell>
    </template>
    <centerInfoBox v-bind="person" class="flot-box"></centerInfoBox>
    <div class="canvas-wapper" v-if="natalChartRef">
      <canvas id="sanfang" :width="natalChartRef?.clientWidth / 2" :height="natalChartRef?.clientHeight / 2"></canvas>
    </div>
  </div>
</template>

<style lang="less" scoped>
.natal-chart {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  display: grid;
  grid-template-columns: repeat(4, 25%);
  gap: 0;
  grid-template-areas: 'si wu wei shen'
    'chen center center you'
    'mao center center xu'
    'yin chou zi hai';

  .flot-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .canvas-wapper {
    z-index: 1;
    position: relative;
    position: absolute;
    width: 50%;
    height: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .active-cell {
    background-color: #cecfcf;
  }
}
</style>
