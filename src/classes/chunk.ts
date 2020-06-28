import Vec3 from "./vec3";
import { BlockVertexInfo, newVertex } from "./blockVertex";
import textures from "textures";
import Block from "./block";

class ChunkMesh {
  byteData: ByteData;
  vertices: number[];
  vertexMap: number[];

  mesh: Mesh;

  isDirty: boolean = true;

  constructor(maxVertexCount: number) {
    this.byteData = love.data.newByteData(BlockVertexInfo.byteSize * maxVertexCount);
    this.vertices = ffi.cast("uint32_t*", this.byteData.getPointer());
    this.vertexMap = [];

    // @ts-ignore
    this.mesh = love.graphics.newMesh(BlockVertexInfo.attributesFormat, this.byteData, "triangles", "dynamic");
    this.mesh.setVertexMap(this.vertexMap);
    this.mesh.setTexture(textures);
  }

  clean() {
    // @ts-ignore
    this.mesh.setVertices(this.byteData);
    this.mesh.setVertexMap(this.vertexMap);

    this.isDirty = false;
  }

  render() {
    if (this.isDirty) {
      this.clean();
    }

    love.graphics.draw(this.mesh);
  }
}

export default class Chunk {
  position: Vec3;

  alphaBitMesh: ChunkMesh;
  tranlucencyMesh: ChunkMesh;

  constructor(position: Vec3) {
    this.position = position;

    this.alphaBitMesh = new ChunkMesh(400);
    this.tranlucencyMesh = new ChunkMesh(400);
    
    this.setVertex(0,  0, 0, 6,  0, 0, 4);
    this.setVertex(1,  2, 0, 6,  1, 0, 4);
    this.setVertex(2,  0, 1, 6,  0, 1, 4);
    this.setVertex(3,  2, 1, 6,  1, 1, 4);
    
    this.setVertex(4,  0, 0, 3,  0, 0, 7);
    this.setVertex(5,  2, 0, 3,  1, 0, 7);
    this.setVertex(6,  0, 1, 3,  0, 1, 7);
    this.setVertex(7,  2, 1, 3,  1, 1, 7);

    this.alphaBitMesh.mesh.setVertexMap([
      5, 6, 7,
      7, 8, 6,
    
      1, 2, 3,
      3, 4, 2,
    ]);

    // @ts-ignore
    this.alphaBitMesh.mesh.setVertices(this.alphaBitMesh.byteData);
  }

  setVertex(index: number, x: number, y: number, z: number, u: number, v: number, layer: number) {
    this.alphaBitMesh.vertices[index - 1] = newVertex(x, y, z, u, v, layer);
  }

  addBlock(block: Block) {

  }

  renderAlphaBit(shader: Shader) {
    shader.send("chunkPosition", this.position.shaderFormat());

    love.graphics.draw(this.alphaBitMesh.mesh);
  }

  renderTranlucency(shader: Shader) {
    shader.send("chunkPosition", this.position.shaderFormat());

    love.graphics.draw(this.tranlucencyMesh.mesh);
  }
}
