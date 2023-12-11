import type { Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>

export type Yao = Array<number>

export interface SentenceYao {
  guaName: string
  index: number
  yaoName: string
  sentence: string
  futureGuaName: string
  code?: number
  property?: string
  fill?: string

}

export interface DoubleGua {
  doubleCode: number
  doubleName: string
  lowerCode: number
  lowerName: string
  lowerSymbol: string
  upperCode: number
  upperName: string
  upperSymbol: string
  doubleSymbol: string
  title: string
  sentence: string
  yaoArray?: SentenceYao[]
  corrYaoArray?: SentenceYao[]
}

export interface RanderResult {
  currentGua: DoubleGua
  futureGua: DoubleGua
}

export interface YaoSentence {
  currentYao: string // 本卦爻辞
  corrYao: string // 关联爻辞
}

export interface OutputInfo {
  changedYaoArray: string[] // 变爻概述
  resultText: string // 占卜结果
  currentSentenceText: string // 本卦卦辞
  currentSentenceArray: YaoSentence[] // 本卦爻辞
  currentChangedSentenceArray: YaoSentence[] // 本卦变爻爻辞
  futureSentenceText: string// 之卦卦辞
  futureSentenceArray: YaoSentence[] // 之卦爻辞
  futureChangedSentenceArray: YaoSentence[]// 之卦变爻爻辞
}
