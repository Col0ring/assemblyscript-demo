import { instantiate } from '@assemblyscript/loader'

const runWasmAdd = async () => {
  // Instantiate our wasm module
  const wasmModule = await instantiate(fetch('../build/Hello-World/index.wasm'))
  // Call the Add function export from wasm, save the result
  const addResult = wasmModule.exports.add(24, 24)

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`
}
runWasmAdd()
