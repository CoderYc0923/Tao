import doubleGuaData from '@/utils/configs/doubleGuaData'
import yaoSentenceData from '@/utils/configs/yaoSentenceData'
import { fillHash, propertyHash } from '@/utils/configs/index'
import type { DoubleGua, SentenceYao, Yao } from '@/typing'

/**
 * 解析卦数据的对象
 */
class GuaAnalyzeControler {
  private currentGua: DoubleGua
  private futureGua: DoubleGua
  constructor() {
  }

  getResult(yaoArray: Yao) {
    // 根据本卦得到之卦
    const futureYaoArray = this.getFutureYaoArray(yaoArray)
    // 生成两个卦对象
    this.currentGua = this.getDoubleGua(yaoArray)
    this.futureGua = this.getDoubleGua(futureYaoArray)

    // tips: 一个完整的复卦对象包含从卦名 到 变爻辞 再到 关联爻辞的所有信息
    // 为卦对象添加属性，生成一个完整的复卦对象
    // 1.爻对象
    this.currentGua.yaoArray = this.getYaoArray(yaoArray)
    this.futureGua.yaoArray = this.getYaoArray(futureYaoArray)
    // 2.关联爻辞
    this.currentGua.corrYaoArray = this.getCorrYaoArray(this.currentGua.yaoArray)
    this.futureGua.corrYaoArray = this.getCorrYaoArray(this.futureGua.yaoArray)

    // 返回完整的卦对象
    return {
      currentGua: this.currentGua,
      futureGua: this.futureGua,
    }
  }

  /**
   * 得到对应的之卦
   */
  getFutureYaoArray(yaoArray: Yao) {
    // 老阴和老阳交换
    return yaoArray.map(yao => this.getFutureYao(yao))
  }

  /**
   * 老阴和老阳交换
   */
  getFutureYao(yao: number) {
    return (yao === 6 || yao === 9) ? (15 - yao) : yao
  }

  /**
   * 得到对应复卦对象
   */
  getDoubleGua(yaoArray: Yao) {
    const yaoString = yaoArray.join('').replaceAll('7', '9').replaceAll('8', '6')
    return doubleGuaData.filter(gua => gua.doubleCode === +yaoString)[0]
  }

  /**
   * 得到对应爻对象
   */
  getYaoArray(yaoArray: Yao) {
    const guaName = this.getDoubleGua(yaoArray).doubleName
    const currentYaoArr = []
    for (let i = 0; i < 6; i++) {
      const yao: SentenceYao = yaoSentenceData.filter(yao => yao.index === i && yao.guaName === guaName[0])[0]
      yao.code = yaoArray[i]
      yao.property = propertyHash[yaoArray[i]]
      yao.fill = fillHash[yaoArray[i]]
      currentYaoArr.push(yao)
    }
    return currentYaoArr
  }

  /**
   * 得到关联爻辞
   */
  getCorrYaoArray(currentYaoArr: SentenceYao[]) {
    return currentYaoArr.map((currentYao) => {
      return yaoSentenceData.filter(yao => yao.index === currentYao.index && yao.guaName === currentYao.futureGuaName)[0]
    })
  }
}

export default GuaAnalyzeControler
