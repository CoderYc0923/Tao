<script setup lang="ts">
import { useStore } from '@/stores'
import { localStorage } from '@/utils/local-storage'

const store = useStore()
const themeStore = localStorage.get('theme')
const checked = ref<boolean>(themeStore === 'dark')

watch(checked, (val) => {
  if (val) {
    store.mode = 'dark'
    localStorage.set('theme', 'dark')
  }
  else {
    store.mode = 'light'
    localStorage.set('theme', 'light')
  }
})
</script>

<template>
  <div class="container">
    <VanCellGroup title="意以象尽，象以言著" inset>
      <VanCell center title="🌗 暗黑模式">
        <template #right-icon>
          <VanSwitch v-model="checked" size="23px" />
        </template>
      </VanCell>

      <VanCell title="📀 卜一卦" to="coin" is-link />

      <!-- <VanCell title="⭐ 命盘" to="chart" is-link /> -->

      <!-- <VanCell title="📊 Echarts 演示" to="charts" is-link /> -->
    </VanCellGroup>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  padding-top: 30px;
  position: relative;

  .logo {
    width: 150px;
    height: 150px;
    background-image: url('@/assets/logo.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
  }

  .custom-title {
    margin-right: 4px;
    vertical-align: middle;
  }
}
</style>
