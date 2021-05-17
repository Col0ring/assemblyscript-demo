// 创建 memory
// 通过增加一页（64KB）的 Wasm Memory
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory#Examples
memory.grow(1)

// 通过 store 函数存储值，存储形式类似数组
const index = 0
const value = 24
store<u8>(index, value)

export function readWasmMemoryAndReturnIndexOne(): i32 {
  // 读取内存里的数据
  let valueAtIndexOne = load<u8>(1)
  // 返回索引为 1 的值（上面默认值设置里索引为 0 的值）
  return valueAtIndexOne
}
