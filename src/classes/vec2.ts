import IFormat from "interfaces/IFormat";
import IShaderFormat from "interfaces/IShaderFormat";

type Vec2Body = {
  x: number;
  y: number;
};

ffi.cdef(`
  typedef struct {
    float x, y;
  } fm_vec2_body_sp;
`);

ffi.cdef(`
  typedef struct {
    float x, y;
  } fm_vec2_body_dp;
`);

export interface IVec2 extends IFormat, IShaderFormat {
  x: number;
  y: number;
}

export default class Vec2 implements IVec2 {
  body: Vec2Body;

  get x() {
    return this.body.x;
  }

  set x(x: number) {
    this.x = x;
  }

  get y() {
    return this.body.y;
  }

  set y(y: number) {
    this.y = y;
  }

  constructor(x: number = 0, y: number = 0, doublePrecision = false) {
    if (doublePrecision) {
      this.body = ffi.new("fm_vec2_body_dp");
    } else {
      this.body = ffi.new("fm_vec2_body_sp")
    }

    this.body.x = x;
    this.body.y = y;
  }

  format(): string {
    return `{${this.x}, ${this.y}}`;
  }

  static shaderFormatTemp: number[] = [];
  shaderFormat() : number[] {
    Vec2.shaderFormatTemp[0] = this.body.x;
    Vec2.shaderFormatTemp[1] = this.body.y;

    return Vec2.shaderFormatTemp;
  }
}