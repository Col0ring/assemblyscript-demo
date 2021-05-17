import { instantiate } from '@assemblyscript/loader'

const runWasm = async () => {
  const wasmModule = await instantiate(
    fetch('../build/WebAssembly-Linear-Memory/index.wasm')
  )

  const exports = wasmModule.instance.exports

  // 获取我们的 memory 对象，在 Wasm 中的内存都在这里面
  const memory = exports.memory

  // 创建 Uint8Array 来允许我们访问 Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(memory.buffer)

  // 在 js 中访问
  console.log(wasmByteMemoryArray[0]) // 24

  // 在 js 中修改内存中的值
  wasmByteMemoryArray[1] = 25
  // 能够正确打印出索引为 1 的值，证明能够修改成功
  console.log(exports.readWasmMemoryAndReturnIndexOne()) // 25
}
runWasm()
