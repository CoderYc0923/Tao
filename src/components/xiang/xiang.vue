<script setup lang="ts">
import type { DoubleGua } from '@/typing'

defineProps<{
  gua: DoubleGua
}>()
</script>

<template>
  <div class="xiang">
    <div v-for="(item, index) in gua.yaoArray" :key="index" class="xiang-item">
      <div class="xiang-item__label">
        {{ `${item.yaoName}(${item.property})` }}
      </div>
      <div
        class="xiang-item__value" :style="{ 'background-color': item.fill }"
        :class="{ 'is-yin': item.code % 2 === 0 }"
      />
    </div>
    <div class="xiang-title">
      卦象：{{ `${gua.doubleSymbol} —— ${gua.doubleName}` }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.xiang {
  width: 100%;
  .xiang-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 10px;

    &__value {
      width: 240px;
      height: 30px;
    }

    .is-yin {
      position: relative;

      &::after {
        content: '';
        width: 50px;
        height: 32px;
        background-color: #eff2f5;
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .xiang-title {
    width: 100%;
    font-weight: bold;
    text-align: center;
  }
}
</style>
