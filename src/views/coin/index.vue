<script setup lang="ts">
import { showToast } from 'vant'
import coinYang from '@/components/coin/coinYang.vue'
import coinYin from '@/components/coin/coinYin.vue'
import xiang from '@/components/xiang/xiang.vue'
import { type Coin, type OutputInfo, ShowType } from '@/typing'
import GuaMainControler from '@/utils/hooks/useDivination'
import useRandomBinary from '@/utils/hooks/useRandom'

const mainControler = new GuaMainControler()
const result = ref<OutputInfo>()
const showType = ref<ShowType>(ShowType.DIVINATION)
const allCoins = ref<Coin[][]>([])
const throwCount = ref<number>(0)
const show = ref<boolean>(false)
const bubbleOffset = ref({ x: 24, y: 400 })
const copyTextsSuffix = ' ———— 解卦自《道之微》'

watch(
  () => throwCount.value,
  (count: number) => {
    if (count >= 6)
      showType.value = ShowType.INTERPRET
    else showType.value = ShowType.DIVINATION
  },
  {
    immediate: true,
  },
)

function throwCoin() {
  const currentCoins: Coin[] = []
  for (let i = 0; i < 3; i++) {
    const number = useRandomBinary()
    const item = {
      number,
      comp: number === 1 ? coinYang : coinYin,
    }
    currentCoins.push(item)
  }
  // 投掷
  mainControler.throwYaoHandle(currentCoins.map(i => i.number))
  throwCount.value++
  allCoins.value.push(currentCoins)
}

function solveGua() {
  const outputYaoDescript = mainControler.calculateYao()
  result.value = outputYaoDescript
  showType.value = ShowType.RENDER
}

function copy() {
  const text = getCopyText()
  copyHandle(text)
  showToast('复制成功')
}

function getCopyText() {
  const copyText = `解卦结果：${result.value.resultText}。[变爻：${result.value.changedYaoArray.join('、')}] [本卦卦辞：${result.value.currentSentenceText}] [之卦卦辞：${result.value.futureSentenceText}]`
  return copyText + copyTextsSuffix
}

function copyHandle(val: string) {
  const inp = document.createElement('input')
  inp.type = 'text'
  inp.value = val
  document.body.appendChild(inp)
  inp.select()
  document.execCommand('Copy', true)
  document.body.removeChild(inp)
}

// reset data
function reset() {
  showType.value = ShowType.DIVINATION
  throwCount.value = 0
  allCoins.value = []
  mainControler.reset()
}

// back
const onClickLeft = () => history.back()

function onClick() {
  show.value = true
}

function onClickModel() {
  show.value = false
}
</script>

<template>
  <VanNavBar title="📀 金钱卦" left-arrow fixed @click-left="onClickLeft" />
  <div class="container">
    <div class="result">
      <div v-if="showType === ShowType.RENDER" class="data-content">
        <div>
          <span>{{ result.resultText }}</span>
          <span><b>变爻：</b>
            <template v-if="result.changedYaoArray.length">
              <span v-for="(item, index) in result.changedYaoArray" :key="index" style="font-weight: bold">{{ item
              }}<i v-if="index < result.changedYaoArray.length - 1">、</i></span>
            </template>
            <template v-else>无</template>
          </span>
          <xiang :gua="result.currentGua" style="margin-top: 10px;" />
          <div class="yao-descript">
            <span><b>本卦卦辞：</b>{{ result.currentSentenceText }}</span>
            <span><b>本卦爻辞：</b></span>
            <template v-if="result.currentSentenceArray.length">
              <div v-for="(item, index) in result.currentSentenceArray" :key="index" class="yao-descript-item">
                <span>[{{ index + 1 }}]</span>
                <span>{{ item.currentYao }}</span>
                <span class="corr-yao">{{ item.corrYao }}</span>
              </div>
            </template>
            <template v-else>
              无
            </template>
            <span><b>本卦变爻爻辞：</b></span>
            <template v-if="result.currentChangedSentenceArray.length">
              <div v-for="(item, index) in result.currentChangedSentenceArray" :key="index" class="yao-descript-item">
                <span>[{{ index + 1 }}]</span>
                <span>{{ item.currentYao }}</span>
                <span class="corr-yao">{{ item.corrYao }}</span>
              </div>
            </template>
            <template v-else>
              无
            </template>
          </div>
          <xiang :gua="result.futureGua" style="margin-top: 30px;" />
          <div class="yao-descript">
            <span><b>之卦卦辞：</b>{{ result.futureSentenceText }}</span>
            <span><b>之卦爻辞：</b></span>
            <template v-if="result.futureSentenceArray.length">
              <div v-for="(item, index) in result.futureSentenceArray" :key="index" class="yao-descript-item">
                <span>[{{ index + 1 }}]</span>
                <span>{{ item.currentYao }}</span>
                <span class="corr-yao">{{ item.corrYao }}</span>
              </div>
            </template>
            <template v-else>
              无
            </template>
            <span><b>之卦变爻爻辞：</b></span>
            <template v-if="result.futureChangedSentenceArray.length">
              <div v-for="(item, index) in result.futureChangedSentenceArray" :key="index" class="yao-descript-item">
                <span>[{{ index + 1 }}]</span>
                <span>{{ item.currentYao }}</span>
                <span class="corr-yao">{{ item.corrYao }}</span>
              </div>
            </template>
            <template v-else>
              无
            </template>
          </div>
        </div>
      </div>
      <div v-else-if="allCoins.length" class="render-content">
        <div v-for="(item, index) in allCoins" :key="index" class="render-coin">
          <component :is="item[0].comp" />
          <component :is="item[1].comp" />
          <component :is="item[2].comp" />
        </div>
      </div>
    </div>
    <div class="tools-area">
      <VanButton v-if="showType === ShowType.DIVINATION" round block type="primary" @click="throwCoin">
        起卦
      </VanButton>
      <VanButton v-else-if="showType === ShowType.INTERPRET" round block type="primary" @click="solveGua">
        解卦
      </VanButton>
      <VanButton v-else round block type="primary" @click="copy">
        一键复制
      </VanButton>
      <VanButton round block type="default" @click="reset">
        重置
      </VanButton>
    </div>
    <van-floating-bubble v-model:offset="bubbleOffset" icon="question-o" axis="xy" magnetic="x" @click="onClick" />
    <van-overlay :show="show" @click="onClickModel">
      <div class="wrapper">
        <div class="tips-model">
          <span>Tips:<b>本卦</b>和<b>之卦</b>是《周易》中的两个卦象，分别代表了两种不同的情况和变化。<b>本卦</b>代表了事物的起始和初步发展，而<b>之卦</b>则代表了事物的进一步发展和转变。</span>
          <span>Tips: 揣摩爻辞含义，可参考爻辞后面<b>带底色的互证单变爻</b>。</span>
          <span>Tips: 解卦手册推荐：<b>《白话高岛易断》</b>、<b>《易经入门·占卦解卦》</b></span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  padding-top: 74px;

  .result {
    height: calc(100% - 60px);
    overflow-y: auto;
    padding: 0 15px;
  }

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
        display: flex;
        flex-direction: column;
        min-height: 10px;
        padding: 10px;
        line-height: 30px;
        background: #fff;
        margin-top: 20px;
        border-radius: 15px;
        font-size: 12px;

        .corr-yao {
          background: #eee;
        }
      }
    }
  }

  .render-content {
    .render-coin {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }

  .tools-area {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 10px;

    .van-button {
      width: 35%;
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .tips-model {
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 80%;
      min-height: 10%;
      max-height: 40%;
      overflow-y: auto;
      border-radius: 10px;
      background-color: #fff;
      padding: 10px;
      span {
        margin-bottom: 10px;
      }
    }
  }
}

[data-theme="dark"] {
  .data-content {
    background: #222;
    color: #fff;
  }
}

.van-button--block {
  margin-top: 15px;
}
</style>
