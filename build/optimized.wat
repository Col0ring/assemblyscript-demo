(module
 (type $none_=>_none (func))
 (type $i32_i32_i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32 i32 i32)))
 (global $assembly/Reading-and-Writing-Graphics/index/CHECKERBOARD_BUFFER_POINTER i32 (i32.const 0))
 (global $assembly/Reading-and-Writing-Graphics/index/CHECKERBOARD_BUFFER_SIZE i32 (i32.const 1600))
 (memory $0 0)
 (export "CHECKERBOARD_BUFFER_POINTER" (global $assembly/Reading-and-Writing-Graphics/index/CHECKERBOARD_BUFFER_POINTER))
 (export "CHECKERBOARD_BUFFER_SIZE" (global $assembly/Reading-and-Writing-Graphics/index/CHECKERBOARD_BUFFER_SIZE))
 (export "generateCheckerBoard" (func $assembly/Reading-and-Writing-Graphics/index/generateCheckerBoard))
 (export "memory" (memory $0))
 (start $~start)
 (func $assembly/Reading-and-Writing-Graphics/index/generateCheckerBoard (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  loop $for-loop|0
   local.get $11
   i32.const 20
   i32.lt_s
   if
    i32.const 0
    local.set $9
    loop $for-loop|1
     local.get $9
     i32.const 20
     i32.lt_s
     if
      local.get $1
      local.set $6
      local.get $2
      local.set $7
      local.get $9
      i32.const 1
      i32.and
      local.tee $10
      local.get $10
      i32.eqz
      local.get $11
      i32.const 1
      i32.and
      select
      if (result i32)
       local.get $0
      else
       local.get $4
       local.set $6
       local.get $5
       local.set $7
       local.get $3
      end
      local.set $8
      local.get $11
      local.get $9
      i32.const 20
      i32.mul
      i32.add
      i32.const 2
      i32.shl
      local.tee $10
      local.get $8
      i32.store8
      local.get $10
      local.get $6
      i32.store8 offset=1
      local.get $10
      local.get $7
      i32.store8 offset=2
      local.get $10
      i32.const 255
      i32.store8 offset=3
      local.get $9
      i32.const 1
      i32.add
      local.set $9
      br $for-loop|1
     end
    end
    local.get $11
    i32.const 1
    i32.add
    local.set $11
    br $for-loop|0
   end
  end
 )
 (func $~start
  i32.const 1
  memory.grow
  drop
 )
)
