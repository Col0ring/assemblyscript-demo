memory.grow(1)

// 在 JavaScript 中写入到 INPUT_BUFFER
export const INPUT_BUFFER_POINTER: i32 = 0
export const INPUT_BUFFER_SIZE: i32 = 1024
// 在 Wasm 中写入结果到 OUTPUT_BUFFER
export const OUTPUT_BUFFER_POINTER: i32 =
  INPUT_BUFFER_POINTER + INPUT_BUFFER_SIZE
export const OUTPUT_BUFFER_SIZE: i32 = INPUT_BUFFER_SIZE

// 放大音频
export function amplifyAudioInBuffer(): void {
  for (let i = 0; i < INPUT_BUFFER_SIZE; i++) {
    // 加载指定传入的音频样本
    let audioSample: u8 = load<u8>(INPUT_BUFFER_POINTER + i)

    // 放大音频样本
    // 以 127 为界限（127 以下为负，127 以上为正），0 为负的最大，256 为正最大
    if (audioSample > 127) {
      let audioSampleDiff = audioSample - 127
      audioSample = audioSample + audioSampleDiff
    } else if (audioSample < 127) {
      audioSample = audioSample / 2
    }

    // 保存转换后的音频样本到 OUTPUT_BUFFER
    store<u8>(OUTPUT_BUFFER_POINTER + i, audioSample)
  }
}
