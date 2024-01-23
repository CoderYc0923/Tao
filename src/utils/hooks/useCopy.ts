export default function copyHandle(val: string) {
  const inp = document.createElement('input')
  inp.type = 'text'
  inp.value = val
  document.body.appendChild(inp)
  inp.select()
  document.execCommand('Copy', true)
  document.body.removeChild(inp)
}