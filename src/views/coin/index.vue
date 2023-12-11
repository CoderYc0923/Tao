<script setup lang="ts">
import type { OutputInfo } from "@/typing";
import GuaMainControler from "@/utils/hooks/useDivination";
import { showToast } from "vant";

const mainControler = new GuaMainControler();
const result = ref<OutputInfo>();
const noResult = ref<boolean>(true);

function pull() {
  const mock = [1, 1, 1];
  for (let i = 0; i < 6; i++) mainControler.throwYaoHandle(mock);

  const outputYaoDescript = mainControler.calculateYao();
  result.value = outputYaoDescript;
  noResult.value = false;
}

function copy() {
  let text = getCopyText();
  copyHandle(text);
  showToast('复制成功')
}

function getCopyText() {
  let copyText = `解卦结果：${result.value.resultText}。变爻：${result.value.changedYaoArray.join('、')}。`
  return copyText
}

function copyHandle(val:string) {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.value = val;
  document.body.appendChild(inp)
  inp.select();
  document.execCommand("Copy", true);
  document.body.removeChild(inp)
}

// reset data
function reset() {
  noResult.value = true;
}

// back
const onClickLeft = () => history.back();
</script>

<template>
  <VanNavBar title="💿 金钱卦" left-arrow fixed @click-left="onClickLeft" />
  <div class="container">
    <div class="result">
      <div class="data-label" v-if="result">解卦结果</div>
      <div class="data-content" v-if="result">
        <div>
          <span>{{ result.resultText }}</span>
          <span
            >变爻：
            <span
              v-for="(item, index) in result.changedYaoArray"
              :key="index"
              style="font-weight: bold"
              >{{ item
              }}<i v-if="index < result.changedYaoArray.length - 1">、</i></span
            >
          </span>
          <div class="yao-descript">
            <span>本卦卦辞：{{ result.currentSentenceText }}</span>
            <span>本卦爻辞：</span>
            <div
              v-for="(item, index) in result.currentSentenceArray"
              :key="index"
              class="yao-descript-item"
            >
              <span>{{ item.currentYao }}</span>
              <span class="corr-yao">{{ item.corrYao }}</span>
            </div>
            <span>本卦变爻爻辞：</span>
            <div
              v-for="(item, index) in result.currentChangedSentenceArray"
              :key="index"
              class="yao-descript-item"
            >
              <span>{{ item.currentYao }}</span>
              <span class="corr-yao">{{ item.corrYao }}</span>
            </div>
          </div>
          <div class="yao-descript">
            <span>之卦卦辞：{{ result.futureSentenceText }}</span>
            <span>之卦爻辞：</span>
            <div
              v-for="(item, index) in result.futureSentenceArray"
              :key="index"
              class="yao-descript-item"
            >
              <span>{{ item.currentYao }}</span>
              <span class="corr-yao">{{ item.corrYao }}</span>
            </div>
            <span>之卦变爻爻辞：</span>
            <div
              v-for="(item, index) in result.futureChangedSentenceArray"
              :key="index"
              class="yao-descript-item"
            >
              <span>{{ item.currentYao }}</span>
              <span class="corr-yao">{{ item.corrYao }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tools-area">
      <VanButton round block type="primary" @click="pull" v-if="noResult"> 解卦 </VanButton>
      <VanButton round block type="primary" @click="copy" v-else> 一键复制 </VanButton>
      <VanButton round block type="default" @click="reset"> 重置 </VanButton>
    </div>
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

    & > div {
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
