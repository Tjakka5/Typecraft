import { MeshVertexDataType, VertexAttribute } from "love.graphics";

ffi.cdef(`
  typedef struct {
    float x, y, z;
    float u, v, w;
  } fm_vertex;
`);

export type BlockVertex = { 
  x: number;
  y: number;
  z: number;

  u: number;
  v: number;
  w: number;
}

export class BlockVertexInfo {
  static byteSize = ffi.sizeof("fm_vertex");
  static attributesFormat: VertexAttribute<MeshVertexDataType>[] = [
    ["VertexPosition", "float", 3],
    ["VertexTexCoord", "float", 3],
  ];
}