import Vec3, { IVec3 } from "./vec3";
import Mat4 from "./mat4";

interface Vec4Body {
  x: number;
  y: number;
  z: number;
  w: number;
};

ffi.cdef(`
  typedef struct {
    float x, y, z, w;
  } fm_vec4_body_sp;
`);

ffi.cdef(`
  typedef struct {
    double x, y, z, w;
  } fm_vec4_body_dp;
`);

export interface IVec4 extends IVec3 {
  w: number;

  format : () => string;
}

export default class Vec4 implements IVec4 {
  body: Vec4Body;

  get x() {
    return this.body.x;
  }

  set x(x: number) {
    this.body.x = x;
  }

  get y() {
    return this.body.y;
  }

  set y(y: number) {
    this.body.y = y;
  }

  get z() {
    return this.body.z;
  }

  set z(z: number) {
    this.body.z = z;
  }

  get w() {
    return this.body.w;
  }

  set w(w: number) {
    this.body.w = w;
  }
  
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0, doublePrecision = false) {
    if (doublePrecision) {
      this.body = ffi.new("fm_vec4_body_dp");
    } else {
      this.body = ffi.new("fm_vec4_body_sp");
    }

    this.body.x = x;
    this.body.y = y;
    this.body.z = z;
    this.body.w = w;
  }

  sub(other: IVec3): Vec3 {
    return new Vec3(); // TODO
  };
  cross(other: IVec3): Vec3 {
    return new Vec3(); // TODO
  };

  mulMat4(mat4: Mat4): IVec4 {
    const out = new Vec4();
    const m = mat4.body;

    out.x = this.x * m.a + this.y * m.e + this.z * m.i + this.w * m.m;
    out.y = this.x * m.b + this.y * m.f + this.z * m.j + this.w * m.n;
    out.z = this.x * m.c + this.y * m.g + this.z * m.k + this.w * m.o;
    out.w = this.x * m.d + this.y * m.h + this.z * m.l + this.w * m.p;

    return out;
  }

  format(): string {
    return `{${this.x}, ${this.y}, ${this.z}, ${this.w}}`;
  }

  static shaderFormatTemp: number[] = [];
  shaderFormat() : number[] {
    Vec4.shaderFormatTemp[0] = this.body.x;
    Vec4.shaderFormatTemp[1] = this.body.y;
    Vec4.shaderFormatTemp[2] = this.body.z;
    Vec4.shaderFormatTemp[3] = this.body.w;

    return Vec4.shaderFormatTemp;
  }
}