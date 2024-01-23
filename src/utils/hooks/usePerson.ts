import { lunar2solar } from '../configs/dateTransform'
import { dizhiChart, getDizhiCode, getShiChen, getTianganCode, getYingongStartTianGan, tiangan, dizhi, palaceNames, wuxingGame, getMainStarsWithZiwei, getMainStarsWithTianfu } from '../configs/map'
import Zodiac from './useZodiac'
import { getSmallStarsConfig } from '../configs/rule'

class Person {
  #fillOrder = ['yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou']
  name: string
  lunarDate: any
  numTime: string
  stars2Palace: any
  palaces: any
  personInfo: any
  natalChart: any
  natalChartMap: any
  fatePalaceIndex: number
  bodyPalaceIndex: number
  wuxingGame: any
  ziweiIndex: number

  constructor(res) {
    this.name = res.name
    this.lunarDate = res.d
    this.numTime = res.t
    this.stars2Palace = {}
    this.palaces = {}
    this.personInfo = {
      lunarInfo: {},
      lMonth: '',
      lDay: '',
      tYear: '',
      dYear: '',
      shichen: '',
      shichenIndex: -1,
    }
    this.fatePalaceIndex = -1
    this.bodyPalaceIndex = -1
    this.ziweiIndex = -1
    this.init()
  }

  /**
   * 获取宫
   */
  getPalace(index: number) {
    const currentIndex = index < 0 ? (index + 12) : (index < 12 ? index : index - 12)
    return this.natalChart[currentIndex]
  }

  init() {
    // 生成农历信息
    this.generateLunarInfo()
    // 设置时辰
    this.setShiChen()
    // 生成十二宫
    this.initZodiac()
    // 放置天干
    this.fillTianGan()
    // 放置命宫
    this.setFatePalace()
    // 放置身宫
    this.setBodyPalace()
    // 放置其他宫
    this.setOtherPalaces()
    // 计算五行局
    this.setWuXingGame()
    // 确定紫微星位置
    this.setZiweiStar()
    // 确定天府星位置
    this.setTianfuStar()
    // 确定其余小星
    this.setOtherRegularSmallStars()
  }

  /**
   * 生成农历信息
   */
  generateLunarInfo() {
    const date: [string, string, string] = this.lunarDate.split('-').map(n => Number(n))
    this.personInfo.lunarInfo = lunar2solar(...date)
    this.personInfo.lMonth = this.personInfo.lunarInfo.lMonth
    this.personInfo.lDay = this.personInfo.lunarInfo.lDay
    const [t, d] = this.personInfo.lunarInfo.gzYear.split('')
    // 获取天干地支年
    this.personInfo.tYear = getTianganCode(t)
    this.personInfo.dYear = getDizhiCode(d)
  }

  /**
   * 设置时辰
   */
  setShiChen() {
    const { shichen, index } = getShiChen(this.numTime)
    this.personInfo.shichen = shichen
    this.personInfo.shichenIndex = index
  }

  /**
   * 生成十二宫
   */
  initZodiac() {
    this.natalChart = reactive([])
    dizhiChart.forEach((item) => {
      this.natalChart.push(new Zodiac(item))
    })
    this.natalChartMap = reactive({})
    this.natalChart.forEach((item, index) => {
      this.natalChartMap[item.dizhiCode] = item
      item.next = this.natalChart[index + 1 > 11 ? 0 : index + 1]
      item.prev = this.natalChart[index - 1 < 0 ? 11 : index - 1]
    })

    // console.log(this.natalChart, this.natalChartMap)
  }

  /**
   * 放置天干
   */
  fillTianGan() {
    const tianGanInfo = getYingongStartTianGan(this.personInfo.lunarInfo.lYear)
    const orderTanGan = [...tiangan.slice(tianGanInfo.index), ...tiangan.slice(0, tianGanInfo.index + 3)]
    this.#fillOrder.forEach((dizhi, idx) => {
      const place = this.natalChartMap[dizhi]
      place.setTianGan(orderTanGan[idx])
    })
  }

  /**
   * 放置命宫
   * 从寅开始，顺时针从1到生月，然后从生月对应的地支的上一个开始，逆时针从 1 开始到时辰
   * eq：（生月 - 1）- 时辰下标 = 命宫下标
   */
  setFatePalace() {
    let index = this.personInfo.lMonth - 1 - this.personInfo.shichenIndex
    if (index < 0) index = index + 12
    const fate = this.#fillOrder[index]
    //放置命宫
    this.natalChartMap[fate].setFatePalace(index)
    this.palaces['ming'] = this.natalChartMap[fate]
    this.fatePalaceIndex = index
  }

  /**
   * 放置身宫
   * 从寅开始，顺时针从1到生月，然后从生月对应的地支的下一个开始，顺时针从 1 开始到时辰
   */
  setBodyPalace() {
    let index = this.personInfo.lMonth - 1 + this.personInfo.shichenIndex
    if (index > 12) index = index - 12
    const body = this.#fillOrder[index]
    //放置命宫
    this.natalChartMap[body].setBodyPalace(index)
    this.palaces['shen'] = this.natalChartMap[body]
    this.bodyPalaceIndex = index
  }

  /**
   * 放置其他宫
   */
  setOtherPalaces() {
    const fateIndex = this.fatePalaceIndex
    const otherPalaces = [...this.#fillOrder.slice(fateIndex + 1), ...this.#fillOrder.slice(0, fateIndex)]
    otherPalaces.forEach((dizhi, index) => {
      const palace = palaceNames[index]
      const palaceIndex = fateIndex + index + 1
      this.natalChartMap[dizhi]?.setPalaceName(palace, palaceIndex > 11 ? palaceIndex - 12 : palaceIndex)
      this.palaces[palace.code] = this.natalChartMap[dizhi]
    })
  }

  /**
   * 计算五行局
   */
  setWuXingGame() {
    const fatePalaceName = this.#fillOrder[this.fatePalaceIndex]
    const { tiangan: t, dizhi: d } = this.natalChartMap[fatePalaceName]
    const tIndex = tiangan.findIndex(tg => t === tg.name)
    const dIndex = dizhi.findIndex(dz => d === dz)
    //根据天干计算到某一个五行局
    const t2Index = parseInt((tIndex / 2).toString())
    //找出地支所需的剩下的连续三个五行局
    let dCalcDep = wuxingGame.slice(t2Index, t2Index + 3)
    const dif = 3 - dCalcDep.length
    if (dif > 0) dCalcDep = dCalcDep.concat(wuxingGame.slice(0, dif))
    let d2Index = parseInt((dIndex / 2).toString())
    this.wuxingGame = dCalcDep[d2Index > 2 ? d2Index - 3 : d2Index]
  }

  setStars2Palace(name: string, palace: string){
    this.stars2Palace[name] = palace
  }

  /**
   * 确定紫微星位置
   */
  setZiweiStar() {
    const { personInfo: { lDay }, wuxingGame: { num } } = this
    let jumpNum = lDay / num
    const isInt = num => Number.isInteger(num)
    const isEvenNum = num => num % 2 === 0
    if (!isInt(jumpNum)) {
      let r = 1
      let s = jumpNum
      while (!isInt(s)) {
        r * num < lDay ? r++ : s = r * num
      }
      const lend = s - lDay
      jumpNum = isEvenNum(lend) ? r + lend : r - lend
    }
    const ziweiIndex = jumpNum - 1
    const stars = getMainStarsWithZiwei(this)
    stars?.forEach((star, index) => {
      if (!star) return
      const palace = this.getPalace(ziweiIndex - index)
      palace.addMainStar(star)
      this.setStars2Palace(star.code, palace)
    })
    this.ziweiIndex = ziweiIndex
  }

  /**
   * 确定天府星位置
   */
  setTianfuStar() {
    const tIndex = 12 - this.ziweiIndex
    const stars = getMainStarsWithTianfu(this)
    stars?.forEach((star, index) => {
      if (!star) return
      const palace = this.getPalace(tIndex + index)
      palace?.addMainStar(star)
      this.setStars2Palace(star.code, palace)
    })
  }

  /**
   * @param { String } startPalaceCode 起始地支code
   * @param { String } startDizhi 开始地支
   * @param { Boolean } direction true:顺时针 false:逆时针
   * @param { String } endDizhi 结束地支
   * @returns { Palace } 返回目标宫位
   * @example 亥起子时，逆时针到生时
   */
  getMovePalace(startPalaceCode, startDizhi, direction, endDizhi) {
    //获取起始宫
    const startPalace = this.natalChartMap[startPalaceCode]
    //获取开始的地支
    const shichenIndex = dizhi.findIndex(dz => dz === startDizhi)
    //获取除了开始地支的其余地支数组
    const newArr = [...dizhi.slice(shichenIndex), ...dizhi.slice(0, shichenIndex)]
    // 到达目标地支的索引
    const scIndex = newArr.findIndex(dz => dz === endDizhi)
    //根据起始宫的位置推到目标宫
    const endPalace = this.getPalace(direction ? startPalace.index + scIndex : startPalace.index - scIndex)
    return endPalace
  }

  /**
   * 确定其余小星
   */
  setOtherRegularSmallStars() {
    const smallStarsConfig = getSmallStarsConfig(this)
    smallStarsConfig.forEach(config => {
      if (!config) return
      const palace = typeof config.rule === 'string' ? this.natalChartMap[config.rule] : this.getMovePalace(...config.rule)
      config.isSub ? palace.addSubStar(config.star) : palace.addSmallStar(config.star)
      config.cb && config.cb(palace)
    })
  }
}

export default Person
