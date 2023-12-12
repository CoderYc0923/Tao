import GuaAnalyzeControler from './useAnalyze'
import GuaRanderControler from './useRander'
import type { Yao } from '@/typing'

/**
 * 接收和输出卦数据的对象
 */
class GuaMainControler {
  private currentYaoArr: Yao
  private baseYaoNumber: number = 6
  private analyzeControler: GuaAnalyzeControler
  private randerControler: GuaRanderControler
  constructor() {
    this.currentYaoArr = []
    this.analyzeControler = new GuaAnalyzeControler()
    this.randerControler = new GuaRanderControler()
  }

  /**
   * 投掷结果处理
   * @param {
   *    coinArr: Array<number> 投掷一次硬币产生的结果数组
   * }
   */
  throwYaoHandle(coinArray: Yao) {
    const yao = coinArray.reduce((coin, sum) => coin + sum, 0) + this.baseYaoNumber
    this.currentYaoArr.push(yao)
  }

  /**
   * 处理卦象数据
   */
  calculateYao() {
    if (this.currentYaoArr.length !== 6) {
      console.warn('当前爻数不满足解卦条件')
      return
    }
    const reslut = this.analyzeControler.getResult(this.currentYaoArr)
    return this.randerControler.output(reslut)
  }

  /**
   * 重置
   */
  reset() {
    this.currentYaoArr = []
    this.analyzeControler.reset()
    this.randerControler.reset()
  }
}

export default GuaMainControler
