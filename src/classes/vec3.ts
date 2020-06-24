import { IVec2 } from "./vec2";

interface Vec3Body {
  x: number;
  y: number;
  z: number;
};

ffi.cdef(`
  typedef struct {
    float x, y, z;
  } fm_vec3_body_sp;
`);

ffi.cdef(`
  typedef struct {
    double x, y, z;
  } fm_vec3_body_dp;
`);

export interface IVec3 extends IVec2 {
  z: number;

  sub: (other: IVec3) => Vec3;
  cross: (other: IVec3) => Vec3;
}

export default class Vec3 implements IVec3 {
  body: Vec3Body;

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
  
  constructor(x: number = 0, y: number = 0, z: number = 0, doublePrecision = false) {
    if (doublePrecision) {
      this.body = ffi.new("fm_vec3_body_dp");
    } else {
      this.body = ffi.new("fm_vec3_body_sp");
    }

    this.body.x = x;
    this.body.y = y;
    this.body.z = z;
  }

  isZero(): boolean {
    return this.x == 0 && this.y == 0 && this.z == 0;
  }

  sub(other: IVec3): Vec3 {
    return new Vec3(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    );
  }

  scaled(scalar: number): Vec3 {
    return new Vec3(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    );
  }

  get length() {
    return math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  get normalized(): Vec3 {
    if (this.isZero()) {
      return new Vec3();
    }
      
    return this.scaled(1 / this.length);
  }

  cross(other: IVec3): Vec3 {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  format(): string {
    return `{${this.x}, ${this.y}, ${this.z}}`;
  }

  static shaderFormatTemp: number[] = [];
  shaderFormat() : number[] {
    Vec3.shaderFormatTemp[0] = this.body.x;
    Vec3.shaderFormatTemp[1] = this.body.y;
    Vec3.shaderFormatTemp[2] = this.body.z;

    return Vec3.shaderFormatTemp;
  }

  static up = new Vec3(0, 1, 0);
}