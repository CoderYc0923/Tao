import type { DoubleGua, OutputInfo, RanderResult, YaoSentence } from '@/typing'

/**
 * 渲染卦数据的对象
 */
class GuaRanderControler {
  private outputInfo: OutputInfo
  constructor() {
    this.outputInfo = {
      changedYaoArray: [], // 变爻概述
      resultText: '', // 占卜结果
      currentSentenceText: '', // 本卦卦辞
      currentSentenceArray: [], // 本卦爻辞
      currentChangedSentenceArray: [], // 本卦变爻爻辞
      futureSentenceText: '', // 之卦卦辞
      futureSentenceArray: [], // 之卦爻辞
      futureChangedSentenceArray: [], // 之卦变爻爻辞
    }
  }

  output(reslut: RanderResult) {
    // 处理占卜结果
    this.handleResult(reslut)
    // 处理变爻
    this.handleChangedYao(reslut)
    // 处理本卦爻辞
    this.handleYaoSentence(reslut.currentGua, true)
    // 处理之卦爻辞
    this.handleYaoSentence(reslut.futureGua, false)
    return this.outputInfo
  }

  handleResult(reslut: RanderResult) {
    const { currentGua, futureGua } = reslut
    this.outputInfo.resultText = `本卦：${currentGua.doubleSymbol}《${currentGua.doubleName}》，之卦：${futureGua.doubleSymbol}《${futureGua.doubleName}》`
  }

  handleChangedYao(reslut: RanderResult) {
    const { currentGua, futureGua } = reslut
    let changedYaoArray = [] // 变爻
    const currentChangedYaoArray = currentGua.yaoArray.filter(yao => this.isChanged(yao.property))
    if (currentGua !== futureGua)
      changedYaoArray = currentChangedYaoArray.map(yao => yao.yaoName)

    this.outputInfo.changedYaoArray = changedYaoArray
  }

  handleYaoSentence(gua: DoubleGua, isCurrent: boolean) {
    const sentenceArr: YaoSentence[] = []
    const changedSentenceArr: YaoSentence[] = []
    for (let i = 0; i < 6; i++) {
      const yaoSentence: YaoSentence = {
        currentYao: '',
        corrYao: '',
      }
      yaoSentence.currentYao = `《${gua.yaoArray[i].guaName}》${gua.yaoArray[i].yaoName}：${gua.yaoArray[i].sentence}`
      yaoSentence.corrYao = `《${gua.corrYaoArray[i].guaName}》${gua.corrYaoArray[i].yaoName}：${gua.corrYaoArray[i].sentence}`
      this.isChanged(gua.yaoArray[i].property) ? changedSentenceArr.push(yaoSentence) : sentenceArr.push(yaoSentence)
    }
    if (isCurrent) {
      this.outputInfo.currentSentenceArray = sentenceArr
      this.outputInfo.currentChangedSentenceArray = changedSentenceArr
    }
    else {
      this.outputInfo.futureSentenceArray = sentenceArr
      this.outputInfo.futureChangedSentenceArray = changedSentenceArr
    }
  }

  isChanged(property: string) {
    return /老/.test(property)
  }
}

export default GuaRanderControler
