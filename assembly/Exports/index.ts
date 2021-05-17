// 按照正常情况导出，可以在导出函数内部使用未导出的函数
export function callMeFromJavascript(a: i32, b: i32): i32 {
  return addIntegerWithConstant(a, b)
}

// 导出一个常量
export const GET_THIS_CONSTANT_FROM_JAVASCRIPT: i32 = 2424

// 没有导出
function addIntegerWithConstant(a: i32, b: i32): i32 {
  return a + b + ADD_CONSTANT
}
// 没有导出
const ADD_CONSTANT: i32 = 1
