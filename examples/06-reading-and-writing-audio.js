// Some general initialization for audio

import { instantiate } from '@assemblyscript/loader'

// 创建音频上下文
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
// buffer 中的样品帧数
const numberOfSamples = 1024
// 用 audioContext 的采样率创建一个空的音频片段
const audioBuffer = audioContext.createBuffer(
  // 2 个声频通道，代表立体声，1 代表是单声道的
  2,
  // 在频率为 audioContext.sampleRate 的音频环境中播放会持续 numberOfSamples / audioContext.sampleRate 秒
  numberOfSamples,
  audioContext.sampleRate
)

// 创建原始样本 buffer 和放大样本 buffer 区域
const originalAudioSamples = new Float32Array(numberOfSamples)
const amplifiedAudioSamples = new Float32Array(numberOfSamples)

// 将浮点样本转换为字节样本
const floatSamplesToByteSamples = (floatSamples) => {
  const byteSamples = new Uint8Array(floatSamples.length)
  // 以 127 为界限（127 以下为负，127 以上为正），0 为负的最大，256 为正最大
  for (let i = 0; i < floatSamples.length; i++) {
    const diff = floatSamples[i] * 127
    byteSamples[i] = 127 + diff
  }
  return byteSamples
}

// 将字节样本转换为浮点样本
const byteSamplesToFloatSamples = (byteSamples) => {
  const floatSamples = new Float32Array(byteSamples.length)
  // 以 127 为界限（127 以下为负，127 以上为正），0 为负的最大，256 为正最大
  for (let i = 0; i < byteSamples.length; i++) {
    const byteSample = byteSamples[i]
    const floatSample = (byteSample - 127) / 127
    floatSamples[i] = floatSample
  }
  return floatSamples
}

const runWasm = async () => {
  const wasmModule = await instantiate(
    fetch('../build/Reading-and-Writing-Audio/index.wasm')
  )

  const exports = wasmModule.instance.exports

  const memory = exports.memory

  const wasmByteMemoryArray = new Uint8Array(memory.buffer)

  // 生成 1024 个浮点音频样本
  // 我们的浮点样本值为 0.3
  const sampleValue = 0.3
  for (let i = 0; i < numberOfSamples; i++) {
    if (i < numberOfSamples / 2) {
      originalAudioSamples[i] = sampleValue
    } else {
      originalAudioSamples[i] = sampleValue * -1
    }
  }

  // 转换后的原始字节样本
  const originalByteAudioSamples = floatSamplesToByteSamples(
    originalAudioSamples
  )

  // 用转换后的音频样本填充 wasm 内存，保存在 INPUT_BUFFER_POINTER 索引中
  wasmByteMemoryArray.set(
    originalByteAudioSamples,
    exports.INPUT_BUFFER_POINTER.value
  )

  // 执行放大音频的函数
  exports.amplifyAudioInBuffer()

  // 获取放大后的音频 buffer
  const outputBuffer = wasmByteMemoryArray.slice(
    exports.OUTPUT_BUFFER_POINTER.value,
    exports.OUTPUT_BUFFER_POINTER.value + exports.OUTPUT_BUFFER_SIZE.value
  )

  // 将放大后的字节样本重新转化为浮点样本
  const outputFloatAudioSamples = byteSamplesToFloatSamples(outputBuffer)
  // 将 outputFloatAudioSamples 设置到 amplifiedAudioSamples 中
  amplifiedAudioSamples.set(outputFloatAudioSamples)
}
runWasm()

function beforePlay() {
  // 检查上下文是否处于挂起状态（自动播放）
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
}

// 全局 audioBufferSource 对象
let audioBufferSource
function stopAudioBufferSource() {
  // 如果 audioBufferSource 有值就暂停并赋值为空
  if (audioBufferSource) {
    audioBufferSource.stop()
    audioBufferSource = undefined
  }
}
function createAndStartAudioBufferSource() {
  // 先停止以前的
  stopAudioBufferSource()

  audioBufferSource = audioContext.createBufferSource()
  // audioBuffer 是我们之前创建的空的音频片段
  audioBufferSource.buffer = audioBuffer
  // 循环播放
  audioBufferSource.loop = true

  // 连接源和输出并启动
  audioBufferSource.connect(audioContext.destination)
  audioBufferSource.start()
}

// UI

const playBtn = document.getElementById('play-btn')
const amplifiedBtn = document.getElementById('amplified-btn')
const pauseBtn = document.getElementById('pause-btn')

playBtn.addEventListener('click', playAmplified)
amplifiedBtn.addEventListener('click', playOriginal)
pauseBtn.addEventListener('click', pause)

function playOriginal() {
  beforePlay()
  // 原始音频
  // 将浮动音频样本设置为左声道和右声道
  audioBuffer.getChannelData(0).set(originalAudioSamples)
  audioBuffer.getChannelData(1).set(originalAudioSamples)

  createAndStartAudioBufferSource()
}

function playAmplified() {
  beforePlay()
  // 放大音频
  // 将浮动音频样本设置为左声道和右声道
  audioBuffer.getChannelData(0).set(amplifiedAudioSamples)
  audioBuffer.getChannelData(1).set(amplifiedAudioSamples)

  createAndStartAudioBufferSource()
}

function pause() {
  beforePlay()
  stopAudioBufferSource()
}
