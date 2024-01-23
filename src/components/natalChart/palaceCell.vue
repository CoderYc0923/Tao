<script setup lang="ts">
const props = defineProps({
  dizhiCode: String,
  code: String,
  dizhi: String,
  tiangan: String,
  isFate: Boolean,
  isBody: Boolean,
  name: String,
  mainStars: Array<any>,
  subStars: Array<any>,
  smallStars: Array<any>
})
const pRef = ref()
const { addRef } = inject('pRefs')
addRef(props.dizhiCode, pRef)

const emits = defineEmits(['click'])
const clickCell = (e) => {
  emits('click', e)
}
</script>

<template>
  <div ref="pRef" :class="`palace-cell palace-cell__${dizhiCode}`" :style="{ gridArea: dizhiCode }" @click="clickCell">
    <div class="palace-stars">
      <div class="palace-star" v-for="star in mainStars" :key="star.code">
        <span>{{ star.name }}</span>
        <span class="star-sihua star-main">{{ star.sihua }}</span>
      </div>
      <div class="palace-star star-sub" v-for="star in subStars" :key="star.code">
        <span>{{ star.name }}</span>
        <span class="star-sihua">{{ star.sihua }}</span>
      </div>
      <div class="palace-star star-small" v-for="star in smallStars" :key="star.code">
        <span>{{ star.name }}</span>
      </div>
    </div>
    <div class="palace-info">
      <div class="info palace-name">{{ name }}</div>
      <div class="info palace-flowyear"></div>
      <div class="info palace-td">{{ tiangan + dizhi }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.palace-cell {
  position: relative;
  box-sizing: border-box;
  border: 1px solid #000000;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  padding: 4px 0;

  .palace-stars {
    display: flex;

    .palace-star {
      line-height: 1.3;
      writing-mode: vertical-lr;
    }

    .star-main {
      color: rgb(193, 83, 5);
    }

    .star-sub {
      color: rgb(200, 88, 200);
    }

    .star-small {
      color: rgb(67, 127, 239);
    }

    .star-sihua {
      color: #fff;
      margin-top: 3px;
      background-color: rgb(255, 29, 67);
      border-radius: 4px;
    }
  }

  .palace-info {
    display: flex;
    align-items: center;

    .info {
      text-align: center;
    }

    .palace-name {
      padding: 0 3px;
      background-color: rgb(0, 133, 205);
      border-radius: 4px;
      color: #fff;
    }
  }
}
</style>
