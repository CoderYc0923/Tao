import { lunar2solar } from '../configs/dateTransform'
import { dizhiChart, getDizhiCode, getShiChen, getTianganCode, getYingongStartTianGan, tiangan } from '../configs/map'
import Zodiac from './useZodiac'

class Person {
  #fillOrder = ['yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou']
  name: string
  lunarDate: any
  numTime: string
  stars2Place: any
  places: any
  personInfo: any
  natalChart: any
  natalChartMap: any

  constructor(res) {
    this.name = res.name
    this.lunarDate = res.d
    this.numTime = res.t
    this.stars2Place = {}
    this.places = {}
    this.personInfo = {
      lunarInfo: {},
      lMonth: '',
      lDay: '',
      tYear: '',
      dYear: '',
      shichen: '',
      shichenIndex: -1,
    }
    this.init()
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
  }

  /**
   * 生成农历信息
   */
  generateLunarInfo() {
    const date: any = this.lunarDate.split('-').map(n => Number(n))
    this.personInfo.lunarInfo = lunar2solar(date)
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
}

export default Person
