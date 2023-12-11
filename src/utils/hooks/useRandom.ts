/**
 * 产生0或1的随机数
 * @params
 */

function useRandomBinary() {
  return Math.random() < 0.5 ? 0 : 1
}

export default useRandomBinary
