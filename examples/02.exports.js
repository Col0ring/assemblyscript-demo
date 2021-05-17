import { instantiate } from '@assemblyscript/loader'
import { wasmBrowserInstantiate } from './demo-util'
const runWasm = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate('../build/Exports/index.wasm')
  // 拿到模块实例对象上的 exports 属性
  const exports = wasmModule.instance.exports

  console.log(exports.callMeFromJavascript(24, 24)) // 49

  // 如果只打印变量不会出现值，而是一个 Global 对象，我们需要获取该对象的 value 属性才能拿到值
  console.log(exports.GET_THIS_CONSTANT_FROM_JAVASCRIPT) // GLobal { value: 2424 }
  console.log(exports.GET_THIS_CONSTANT_FROM_JAVASCRIPT.valueOf()) //  2424
  console.log(exports.GET_THIS_CONSTANT_FROM_JAVASCRIPT.value) //  2424
  // 打印一个没有导出的函数
  console.log(exports.addIntegerWithConstant) // undefined
}
runWasm()
