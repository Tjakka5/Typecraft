import Vec4, { IVec4 } from "./vec4";
import IFormat from "interfaces/IFormat";
import IShaderFormat from "interfaces/IShaderFormat";
import Vec3, { IVec3 } from "./vec3";

type MatrixBody = {
  a: number;
  b: number;
  c: number;
  d: number;

  e: number;
  f: number;
  g: number;
  h: number;

  i: number;
  j: number;
  k: number;
  l: number;

  m: number;
  n: number;
  o: number;
  p: number;
}

ffi.cdef(`
  typedef struct {
    float a, b, c, d;
    float e, f, g, h;
    float i, j, k, l;
    float m, n, o, p;
  } fm_matrix_body;
`);

export default class Mat4 implements IFormat, IShaderFormat {
  body: MatrixBody = ffi.new("fm_matrix_body");

  static temp = new Mat4();

  constructor(
    a = 0,
    b = 0,
    c = 0,
    d = 0,
    e = 0,
    f = 0,
    g = 0,
    h = 0,
    i = 0,
    j = 0,
    k = 0,
    l = 0,
    m = 0,
    n = 0,
    o = 0,
    p = 0,
  ) {
    this.body.a = a;
    this.body.b = b;
    this.body.c = c;
    this.body.d = d;
    this.body.e = e;
    this.body.f = f;
    this.body.g = g;
    this.body.h = h;
    this.body.i = i;
    this.body.j = j;
    this.body.k = k;
    this.body.l = l;
    this.body.m = m;
    this.body.n = n;
    this.body.o = o;
    this.body.p = p;
  }

  static identity = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

  static fromOrthographic(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number
  ): Mat4 {
    const out = new Mat4();
    const outB = out.body;

    outB.a = 2 / (right - left);
    outB.f = 2 / (top - bottom);
    outB.k = -2 / (far - near);
    outB.l = -((right + left) / (right - left));
    outB.m = -((top + bottom) / (top - bottom));
    outB.n = -((far + near) / (far - near));
    outB.o = 1;

    return out;
  }

  static fromPerspective(
    fovy: number,
    aspect: number,
    near: number,
    far: number
  ): Mat4 {
    const t = math.tan(math.rad(fovy) / 2);

    const out = new Mat4();
    const outB = out.body;

    outB.a = 1 / (t * aspect);
    outB.f = 1 / t;
    outB.k = -(far + near) / (far - near);
    outB.l = -1;
    outB.o = -(2 * far * near) / (far - near);
    outB.p = 0;

    return out;
  }

  clone() : Mat4 {
    const mb = this.body;

    const out = new Mat4(
      mb.a, mb.b, mb.c, mb.d,
      mb.e, mb.f, mb.g, mb.h,
      mb.i, mb.j, mb.k, mb.l,
      mb.l, mb.m, mb.n, mb.o
    );

    return out;
  }

  lookAt(eye: IVec3, lookAt: IVec3, up = Vec3.up) {
    const mb = this.body;
  
    const zAxis = eye.sub(lookAt).normalized;
    const xAxis = up.cross(zAxis).normalized;
    const yAxis = zAxis.cross(xAxis);

    mb.a = xAxis.x;
    mb.b = yAxis.x;
    mb.c = zAxis.x;
    mb.d = 0;
    mb.e = xAxis.y;
    mb.f = yAxis.y;
    mb.g = zAxis.y;
    mb.h = 0;
    mb.i = xAxis.z;
    mb.j = yAxis.z;
    mb.k = zAxis.z;
    mb.l = 0;
    mb.m = mb.a * eye.x - mb.e - eye.y - mb.i * eye.z;
    mb.n = mb.b * eye.x - mb.f - eye.y - mb.j * eye.z;
    mb.o = mb.c * eye.x - mb.g - eye.y - mb.k * eye.z;
    mb.p = mb.d * eye.y - mb.h - eye.y - mb.l * eye.z + 1;
  }

  mulVec4(vec4: IVec4): IVec4 {
    const out = new Vec4();
    const m = this.body;

    out.x = vec4.x * m.a + vec4.y * m.b + vec4.z * m.c + vec4.w * m.d;
    out.y = vec4.x * m.e + vec4.y * m.f + vec4.z * m.g + vec4.w * m.h;
    out.z = vec4.x * m.i + vec4.y * m.j + vec4.z * m.k + vec4.w * m.l;
    out.w = vec4.x * m.m + vec4.y * m.n + vec4.z * m.o + vec4.w * m.p;

    return out;
  }

  mulMat4(other: Mat4): Mat4 {
    const out = new Mat4();

    const m1 = this.body;
    const m2 = other.body;

    // TODO

    return out;
  }

  format(): string {
    let m = this.body;
    return `{${m.a}, ${m.b}, ${m.c}, ${m.d}}\n{${m.e}, ${m.f}, ${m.g}, ${m.h}}\n{${m.i}, ${m.j}, ${m.k}, ${m.l}}\n{${m.m}, ${m.n}, ${m.o}, ${m.p}}\n`;
  }

  static shaderFormatTemp : number[] = [];
  shaderFormat(): number[] {
    const mb = this.body;
    const temp = Mat4.shaderFormatTemp;

    temp[0] = mb.a;
    temp[1] = mb.b;
    temp[2] = mb.c;
    temp[3] = mb.d;

    temp[4] = mb.e;
    temp[5] = mb.f;
    temp[6] = mb.g;
    temp[7] = mb.h;

    temp[8] = mb.i;
    temp[9] = mb.j;
    temp[10] = mb.k;
    temp[11] = mb.l;

    temp[12] = mb.m;
    temp[13] = mb.n;
    temp[14] = mb.o;
    temp[15] = mb.p;

    return Mat4.shaderFormatTemp;
  }
}
