import { instantiate } from '@assemblyscript/loader'
const runWasm = async () => {
  const wasmModule = await instantiate(
    fetch('../build/Reading-and-Writing-Graphics/index.wasm')
  )

  const exports = wasmModule.instance.exports

  // 获取我们的 memory 对象，在 Wasm 中的内存都在这里面
  const memory = exports.memory

  // 创建 Uint8Array 来允许我们访问 Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(memory.buffer)

  const canvasElement = document.querySelector('canvas')

  const canvasContext = canvasElement.getContext('2d')
  // 绘制宽高
  const canvasImageData = canvasContext.createImageData(
    canvasElement.width,
    canvasElement.height
  )

  // 随机获取值
  const getDarkValue = () => {
    return Math.floor(Math.random() * 100)
  }

  const getLightValue = () => {
    return Math.floor(Math.random() * 127) + 127
  }

  const drawCheckerBoard = () => {
    exports.generateCheckerBoard(
      getDarkValue(),
      getDarkValue(),
      getDarkValue(),
      getLightValue(),
      getLightValue(),
      getLightValue()
    )

    // 从内存中取出我们保存的光栅值，只取光栅开始到结束所占的内存空间
    const imageDataArray = wasmByteMemoryArray.slice(
      // 我们在 Wasm 中导出的值
      exports.CHECKERBOARD_BUFFER_POINTER.value,
      exports.CHECKERBOARD_BUFFER_SIZE.value
    )

    // 设置 values
    canvasImageData.data.set(imageDataArray)

    // 清空 canvas
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height)

    // 绘制新的图形
    canvasContext.putImageData(canvasImageData, 0, 0)
  }

  drawCheckerBoard()
  setInterval(() => {
    drawCheckerBoard()
  }, 1000)
}
runWasm()
