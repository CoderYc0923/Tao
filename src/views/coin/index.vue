<script setup lang="ts">
import GuaMainControler from '@/utils/hooks/useDivination'
import type { OutputInfo } from '@/typing'

const mainControler = new GuaMainControler()
const result = ref<OutputInfo>()

function pull() {
  const mock = [1, 1, 1]
  for (let i = 0; i < 6; i++)
    mainControler.throwYaoHandle(mock)

  const outputYaoDescript = mainControler.calculateYao()
  result.value = outputYaoDescript
}

// reset data
function reset() {

}

// back
const onClickLeft = () => history.back()
</script>

<template>
  <VanNavBar title="💿 金钱卦" left-arrow fixed @click-left="onClickLeft" />

  <div class="container">
    <div class="data-label">
      解卦结果
    </div>
    <div class="data-content">
      <div v-if="result">
        <span>{{ result.resultText }}</span>
        <span>变爻：
          <span v-for="(item, index) in result.changedYaoArray" :key="index" style="font-weight: bold;">{{ item }}<i
            v-if="index < result.changedYaoArray.length - 1"
          >、</i></span>
        </span>
        <div class="yao-descript">
          <span>本卦卦辞：{{ result.currentSentenceText }}</span>
          <span>本卦爻辞：</span>
          <div v-for="(item, index) in result.currentSentenceArray" :key="index" class="yao-descript-item">
            <span>{{ item.currentYao }}</span>
            <span>{{ item.corrYao }}</span>
          </div>
          <span>本卦变爻爻辞：</span>
          <div v-for="(item, index) in result.currentChangedSentenceArray" :key="index" class="yao-descript-item">
            <span>{{ item.currentYao }}</span>
            <span>{{ item.corrYao }}</span>
          </div>
        </div>
        <div class="yao-descript">
          <span>之卦卦辞：{{ result.futureSentenceText }}</span>
          <span>之卦爻辞：</span>
          <div v-for="(item, index) in result.futureSentenceArray" :key="index" class="yao-descript-item">
            <span>{{ item.currentYao }}</span>
            <span>{{ item.corrYao }}</span>
          </div>
          <span>之卦变爻爻辞：</span>
          <div v-for="(item, index) in result.futureChangedSentenceArray" :key="index" class="yao-descript-item">
            <span>{{ item.currentYao }}</span>
            <span>{{ item.corrYao }}</span>
          </div>
        </div>
      </div>
      <VanEmpty v-else description="暂无数据" />
    </div>

    <div class="tools-area">
      <VanButton round block type="primary" @click="pull">
        解卦
      </VanButton>
      <VanButton round block type="default" @click="reset">
        重置
      </VanButton>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 74px 30px;

  .data-label {
    color: #969799;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
  }

  .data-content {
    line-height: 30px;
    margin-top: 20px;

    &>div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .yao-descript {
        min-height: 10px;
        padding: 20px;
        line-height: 30px;
        background: #fff;
        margin-top: 20px;
        border-radius: 15px;
      }
    }
  }

  .tools-area {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .van-button {
      width: 35%;
    }
  }
}

[data-theme='dark'] {
  .data-content {
    background: #222;
    color: #fff;
  }
}

.van-button--block {
  margin-top: 15px;
}
</style>
