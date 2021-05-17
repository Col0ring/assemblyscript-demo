// 创建 memory
memory.grow(1)

// 定义光栅数量
const CHECKERBOARD_SIZE: i32 = 20

//创建一个缓冲区/指针（数组索引和大小），指向我们在内存中存储像素。
// memoryBase，向外抛出内存的起始偏移量
export const CHECKERBOARD_BUFFER_POINTER: i32 = 0
// 需要占用内存的总值，最后乘以 4 是因为每个格子需要存 (r,g,b,a) 四个值
export const CHECKERBOARD_BUFFER_SIZE: i32 =
  CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4

// 按像素逐步生成光栅，传入 rgb 的亮暗值
export function generateCheckerBoard(
  darkValueRed: i32,
  darkValueGreen: i32,
  darkValueBlue: i32,
  lightValueRed: i32,
  lightValueGreen: i32,
  lightValueBlue: i32
): void {
  // 因为 WebAssembly 的线性内存是一个一维数组，所以我们需要做二维到一维的映射
  for (let x: i32 = 0; x < CHECKERBOARD_SIZE; x++) {
    for (let y: i32 = 0; y < CHECKERBOARD_SIZE; y++) {
      // 当前格子有亮色和暗色两种选择
      let isDarkSquare: boolean = true

      // 判断当前格子的亮按情况
      // 如果 y 是偶数则是亮色
      if (y % 2 === 0) {
        isDarkSquare = false
      }
      // 如果 x 是偶数则亮度取反
      if (x % 2 === 0) {
        isDarkSquare = !isDarkSquare
      }

      // 对当前格子的 rgb 赋值
      let squareValueRed = darkValueRed
      let squareValueGreen = darkValueGreen
      let squareValueBlue = darkValueBlue

      if (!isDarkSquare) {
        squareValueRed = lightValueRed
        squareValueGreen = lightValueGreen
        squareValueBlue = lightValueBlue
      }

      // 通过二维到一维的映射计算索引
      let squareNumber = y * CHECKERBOARD_SIZE + x
      // 注意还要乘以 4，因为每个格子需要保存 4 个值（r,g.b.a）
      let squareRgbaIndex = squareNumber * 4

      // 通过 store 保存所有值在内存中
      store<u8>(
        CHECKERBOARD_BUFFER_POINTER + squareRgbaIndex + 0,
        squareValueRed
      ) // Red
      store<u8>(
        CHECKERBOARD_BUFFER_POINTER + squareRgbaIndex + 1,
        squareValueGreen
      ) // Green
      store<u8>(
        CHECKERBOARD_BUFFER_POINTER + squareRgbaIndex + 2,
        squareValueBlue
      ) // Blue
      store<u8>(CHECKERBOARD_BUFFER_POINTER + squareRgbaIndex + 3, 255) // Alpha (始终不透明)
    }
  }
}
