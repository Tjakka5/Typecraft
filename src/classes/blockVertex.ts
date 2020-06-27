import { MeshVertexDataType, VertexAttribute } from "love.graphics";

ffi.cdef(`
	typedef struct {
		uint32_t inVertexData;
	} fm_vertex;
`);


export function newVertex(x: number, y: number, z: number, u: number, v: number, layer: number): number {
	return (x & 0x1F) | (y & 0x1F) << 5 | (z & 0x1F) << 10 | (u & 0x1) << 15 | (v & 0x1) << 16 | (layer & 0xF) << 17;
}

export class BlockVertexInfo {
	static byteSize = ffi.sizeof("fm_vertex");
	static attributesFormat: VertexAttribute<MeshVertexDataType>[] = [
		["VertexPosition", "float", 1],
	];
}