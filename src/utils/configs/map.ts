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
