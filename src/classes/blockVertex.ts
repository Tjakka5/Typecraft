import { MeshVertexDataType, VertexAttribute } from "love.graphics";

ffi.cdef(`
	typedef struct {
		float inVertexData;
	} fm_vertex;
`);


export function newVertex(x: number, y: number, z: number): number {
	return x | y << 5 | z << 10;
}

export class BlockVertexInfo {
	static byteSize = ffi.sizeof("fm_vertex");
	static attributesFormat: VertexAttribute<MeshVertexDataType>[] = [
		["VertexPosition", "float", 1],
	];
}