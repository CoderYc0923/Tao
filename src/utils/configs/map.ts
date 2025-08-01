/**
 * 五行局
 */
export const wuxingGame = [
  { name: '金四局', num: 4 },
  { name: '水二局', num: 2 },
  { name: '火六局', num: 6 },
  { name: '土五局', num: 5 },
  { name: '木三局', num: 3 },
]

/**
 * 十二宫信息表（除了命宫）
 */
export const palaceNames = [
  { name: '父母', code: 'fumu' },
  { name: '福德', code: 'fude' },
  { name: '田宅', code: 'tianzhai' },
  { name: '官禄', code: 'guanlu' },
  { name: '朋友', code: 'pengyou' },
  { name: '迁移', code: 'qianyi' },
  { name: '疾厄', code: 'jie' },
  { name: '财帛', code: 'caibo' },
  { name: '子女', code: 'zinv' },
  { name: '夫妻', code: 'fuqi' },
  { name: '兄弟', code: 'xiongdi' },
]
/**
 * 天干信息表
 */
export const tiangan = [
  { name: '甲', code: 'jia' },
  { name: '乙', code: 'yi' },
  { name: '丙', code: 'bing' },
  { name: '丁', code: 'ding' },
  { name: '戊', code: 'wu' },
  { name: '己', code: 'ji' },
  { name: '庚', code: 'geng' },
  { name: '辛', code: 'xin' },
  { name: '壬', code: 'ren' },
  { name: '癸', code: 'gui' },
]

/**
 * 地支信息表
 */
export const dizhiChart = [
  { dizhi: '寅', code: 'yin' },
  { dizhi: '卯', code: 'mao' },
  { dizhi: '辰', code: 'chen' },
  { dizhi: '巳', code: 'si' },
  { dizhi: '午', code: 'wu' },
  { dizhi: '未', code: 'wei' },
  { dizhi: '申', code: 'shen' },
  { dizhi: '酉', code: 'you' },
  { dizhi: '戌', code: 'xu' },
  { dizhi: '亥', code: 'hai' },
  { dizhi: '子', code: 'zi' },
  { dizhi: '丑', code: 'chou' },
]

/**
 * 地支信息数组
 */
export const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

/**
 * 获取天干
 */
export const getTianganCode = name => tiangan.find(tg => tg.name === name)?.code
/**
 * 获取地支
 */
export const getDizhiCode = name => dizhiChart.find(dz => dz.dizhi === name)?.code

/**
 * 获取时辰
 */
export function getShiChen(time: string) {
  const hour = Number(time.split(':')[0])
  let index = Math.round(hour / 2)
  if (index > 11)
    index = 0

  return {
    shichen: dizhi[index],
    index,
  }
}

/**
 * 从寅宫开始放置天干
 */
export function getYingongStartTianGan(year: number) {
  const endNum = year.toString().charAt(3)
  let name = null
  let index = null
  if (endNum === '4' || endNum === '9')
    index = tiangan.findIndex(i => i.name === '丙')
  if (endNum === '0' || endNum === '5')
    index = tiangan.findIndex(i => i.name === '戊')
  if (endNum === '6' || endNum === '1')
    index = tiangan.findIndex(i => i.name === '庚')
  if (endNum === '7' || endNum === '2')
    index = tiangan.findIndex(i => i.name === '壬')
  if (endNum === '8' || endNum === '3')
    index = tiangan.findIndex(i => i.name === '甲')
  name = tiangan[index].name
  return {
    name,
    index,
  }
}

/**
 * 四化信息表
 */
export const sihuaMap = {
  jia: {
    lianzhen: '禄',
    pojun: '权',
    wuqu: '科',
    taiyang: '忌',
  },
  yi: {
    tianji: '禄',
    tianliang: '权',
    ziwei: '科',
    taiyin: '忌',
  },
  bing: {
    tiantong: '禄',
    tianji: '权',
    wenchang: '科',
    lianzhen: '忌',
  },
  ding: {
    taiyin: '禄',
    tiantong: '权',
    tianji: '科',
    jumen: '忌',
  },
  wu: {
    tanlang: '禄',
    taiyin: '权',
    youbi: '科',
    tianji: '忌',
  },
  ji: {
    wuqu: '禄',
    tanlang: '权',
    tianliang: '科',
    wenqu: '忌',
  },
  geng: {
    taiyang: '禄',
    wuqu: '权',
    taiyin: '科',
    tiantong: '忌',
  },
  xin: {
    jumen: '禄',
    taiyang: '权',
    wenqu: '科',
    wenchang: '忌',
  },
  ren: {
    tianliang: '禄',
    ziwei: '权',
    zuofu: '科',
    wuqu: '忌',
  },
  gui: {
    pojun: '禄',
    jumen: '权',
    taiyin: '科',
    tanlang: '忌',
  },
}

/**
 * 根据紫微星获取主星信息
 * eq: 确定紫薇 =》逆时针依次 天机 =》 空格 =》 太阳 =》 武曲 =》 天同 =》 空两格 =》 廉贞
 */

export function getMainStarsWithZiwei(person: any) {
  const t = person.personInfo.tYear
  return [
    { name: '紫薇', code: 'ziwei', sihua: sihuaMap[t].ziwei },
    { name: '天机', code: 'tianji', sihua: sihuaMap[t].tianji },
    null,
    { name: '太阳', code: 'taiyang', sihua: sihuaMap[t].taiyang },
    { name: '武曲', code: 'wuqu', sihua: sihuaMap[t].wuqu },
    { name: '天同', code: 'tiantong', sihua: sihuaMap[t].tiantong },
    null,
    null,
    { name: '廉贞', code: 'lianzhen', sihua: sihuaMap[t].lianzhen },
  ]
}

/**
 * 根据天府星获取主星信息
 * eq: 确定天府 =》 顺时针： 天府 =》 太阴 =》 贪狼 =》 巨门 =》 天相 =》 天梁 =》 七杀 => 空三格 =》 破军
 */
export function getMainStarsWithTianfu(person) {
  const t = person.personInfo.tYear
  return [
    { name: '天府', code: 'tianfu', sihua: sihuaMap[t].tianfu },
    { name: '太阴', code: 'taiyin', sihua: sihuaMap[t].taiyin },
    { name: '贪狼', code: 'tanlang', sihua: sihuaMap[t].tanlang },
    { name: '巨门', code: 'jumen', sihua: sihuaMap[t].jumen },
    { name: '天相', code: 'tianxaing', sihua: sihuaMap[t].tianxaing },
    { name: '天梁', code: 'tianliang', sihua: sihuaMap[t].tianliang },
    { name: '七杀', code: 'qisha', sihua: sihuaMap[t].qisha },
    null,
    null,
    null,
    { name: '破军', code: 'pojun', sihua: sihuaMap[t].pojun },
  ]
}
