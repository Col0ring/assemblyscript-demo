// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
// 封装 WebAssembly 模块的读取函数
export const wasmBrowserInstantiate = async (
  wasmModuleUrl,
  importObject = {
    env: {
      abort: () => console.log('Abort!')
    }
  }
) => {
  let response

  if (typeof importObject?.env?.abort !== 'function') {
    importObject = Object.assign({}, importObject, {
      env: {
        abort: () => console.log('Abort!')
      }
    })
  }
  // 判断是否支持 streaming instantiation
  if (WebAssembly.instantiateStreaming) {
    // 请求模块然后初始化
    response = await WebAssembly.instantiateStreaming(
      fetch(wasmModuleUrl),
      importObject
    )
  } else {
    // 不支持要 fallback，手动转成 Buffer
    const fetchAndInstantiateTask = async () => {
      const wasmArrayBuffer = await fetch(wasmModuleUrl).then((response) =>
        response.arrayBuffer()
      )
      return WebAssembly.instantiate(wasmArrayBuffer, importObject)
    }
    response = await fetchAndInstantiateTask()
  }

  return response
}
