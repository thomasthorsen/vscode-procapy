# Procapy

Programmer's Calculator in Python for Visual Studio Code. This is an inline calculator to use inside any document view in Visual Studio Code. Use inside existing views (e.g. source files) for quick inline calculations or dedicate a blank/unsaved view to use as an embedded standalone calculator.

## Usage

Simply select an expression (or multiple expressions using multiple selections) and execute the calculator by pressing the keyboard shortcut and the selection(s) will be replaced by the result of the calculation. Alternatively, if there are no selections, the line of the cursor will be parsed and the result inserted on the line after it (also works with multiple cursors). This is useful when using it as a normal calculator to incrementally perform a sequence of calculations using the result of the previous calculation as input for the following calculation leaving each step in the series of calculations visible.

Procapy supports any valid Python, and will reduce the result of any expression to a number (or an error string if something did not parse correctly).

The default keyboard shortcuts are:

 * Alt-Enter: Calculate decimal
 * Ctrl-Alt-Enter: Calculate hex
 * Shift-Alt-Enter: Calculate binary
 * Shift-Ctrl-Alt-Enter: Calculate octal

## Built-in functions

In addition to the Python standard functions, math and cmath modules (the latter imported into the cmath namespace), Procapy adds the following functions that are useful in programming:

 * u(w, x): truncate x to an unsigned integer of width w.
 * u8(x), u16(x), u32(x), u64(x): truncate x to an unsigned integer of the indicated width.
 * i(w, x): truncate x to a signed integer of width w.
 * i8(x), i16(x), i32(x), i64(x): truncate x to a signed integer of the indicated width.

These are similar to the built-in function int(x) which will truncate to an integer of unlimited width.

In addition, the variable n is assigned a value matching the index of each selection. This can be used in mathematical expressions to form different results for each selection.

## Examples

Difference between two hex numbers:

 * "0x0003 - 0x0007"
   * Decimal: "-4"

Same but truncated to 32bit unsigned range which reveals the two's complement encoding of the negative number:

 * "u32(0x0003 - 0x0007)"
   * Hex: "0xfffffffc"

Division and addition:

 * "800 / 33 + 500 / 42"
   * Decimal: "36.14718614718615"
   * Hex: "0x24"
   * Binary: "0b100100"

Same but adding truncation to 8bit unsigned of intermediate results:

 * c "u8(800 / 33) + u8(500 / 42)"
   * Decimal: "35"

Interpretation of a positive hex number as unsigned integer:

 * "0xfffffffe"
   * Decimal: "4294967294"

Same but showing truncatated to 32bit signed integer, revealing the value when interpreted as a two's complement encoding:

 * "i32(0xfffffffe)"
   * Decimal: "-2"

Comparison operators return True/False in decimal mode and 0/1 in hex/binary/octal:

 * "0x0003 - 0xffff > 50"
   * Decimal: "False"
   * Hex: "0x0"
   * Binary: "0b0"

Same but with truncation of intermediate result to 32bit unsigned integer:

 * "u32(0x0003 - 0xffff) > 50"
   * Decimal: "True"

Mixed radix calculations:

 * "0b1011 + 0x5 + 5"
   * Decimal: "21"
   * Hex: "0x15"

Bitwise operators (OR, NOT, AND, XOR):

 * "0b1011 | ~0x5 & 5 ^ 0b101"
   * Decimal: "15"
   * Hex: "0xf"
   * Binary: "0b1111"

Shift operators:

 * "(1 << 7) >> 3"
   * Decimal: "16"
   * Hex: "0x10"
   * Binary: "0b10000"

Boolean operators and (in)equality:

 * "45 > 5 and 6 < 7 or 5 == 3 and 4 != 4"
   * Decimal: "True"

Rounding:

 * "round(4.51)"
   * Decimal: "5"

## Known Issues

 * Just calls "python" (TODO: find a suitable python or make it possible to select)
 * Not extending selection to full line when there is no selection

## Release Notes

### 0.0.1

Initial release of Procapy

### 0.0.2

 * Support hex/binary/octal
 * Add keybindings
 * Handle syntax errors from Python
