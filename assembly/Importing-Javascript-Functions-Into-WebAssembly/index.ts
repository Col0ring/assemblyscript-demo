
// 定义一个 imports 对象的函数
// @ts-ignore
// 只修改函数名
@external("consoleLog3")
declare function consoleLog(arg0: i32): void
// import consoleLog from index
// @ts-ignore
// 修改模块名和变量名
@external("foo", "consoleLog4")
declare function consoleLog2(arg0: i32): void
// import consoleLog4 from foo
consoleLog(24)
consoleLog2(25)