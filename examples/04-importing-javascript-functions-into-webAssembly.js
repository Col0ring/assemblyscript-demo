import { instantiate } from '@assemblyscript/loader'
const runWasm = async () => {
  const wasmModule = await instantiate(
    fetch(
      '../build/Importing-Javascript-Functions-Into-WebAssembly/index.wasm'
    ),
    {
      // 默认是文件名
      index: {
        consoleLog3: (value) => console.log(value)
      },
      foo: {
        consoleLog4: (value) => console.log(value)
      }
    }
  )
}
runWasm()
