#!/usr/bin/python3

from __future__ import print_function
from math import *
import cmath
import sys
import ast

# Truncation to arbitrary width unsigned integer
def u(width, value):
    return int(value) & (2 ** width - 1)
def u8(value):
    return u(8, value)
def u16(value):
    return u(16, value)
def u32(value):
    return u(32, value)
def u64(value):
    return u(64, value)

# Truncation to arbitrary width signed integer
def i(width, value):
    result = int(value) & (2 ** (width - 1) - 1)
    if (int(value) & (1 << (width - 1))):
        result = -((result ^ (2 ** (width - 1) - 1)) + 1)
    return result
def i8(value):
    return i(8, value)
def i16(value):
    return i(16, value)
def i32(value):
    return i(32, value)
def i64(value):
    return i(64, value)

try:
    program = " ".join(sys.argv[2:])
    code_block = ast.parse(program)
    ends_with_expression = isinstance(code_block.body[-1], ast.Expr)
    if ends_with_expression:
        expression = ast.Expression(code_block.body.pop().value)
        exec(compile(code_block, filename='<procapy>', mode='exec'))
        result = eval(compile(expression, filename='<procapy>', mode='eval'))
        if result is not None:
            radix = sys.argv[1]
            if radix == "hex":
                result = hex(int(result))
            if radix == "binary":
                result = bin(int(result))
            if radix == "octal":
                result = oct(int(result))
            result = str(result)
            print(result, end='')
    else:
        exec(program)
except:
    print(sys.exc_info()[0].__name__ + ": " + str(sys.exc_info()[1]), end='')