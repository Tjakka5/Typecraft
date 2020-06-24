import Mat4 from "classes/mat4";
import { BlockVertex, BlockVertexInfo } from "classes/blockVertex";
import Vec3 from "classes/vec3";

const image = love.graphics.newArrayImage([
  "assets/tiles/stone.png",
  "assets/tiles/wood.png",
  "assets/tiles/brick_red.png",
  "assets/tiles/cotton_blue.png",
], {
  mipmaps: true
})

const byteData = love.data.newByteData(BlockVertexInfo.byteSize * 16);
const vertices: BlockVertex[] = ffi.cast("fm_vertex*", byteData.getPointer());

function setVertex(index: number, x: number, y: number, z: number, u: number, v: number, w: number) {
  let vertex = vertices[index - 1];

  vertex.x = x;
  vertex.y = y;
  vertex.z = z;
  
  vertex.u = u;
  vertex.v = v;
  vertex.w = w;
}

setVertex(0, -10, -10, 50, 0, 0, 0);
setVertex(1,  10, -10, 50, 1, 0, 0);
setVertex(2, -10,  10, 50, 0, 1, 0);
setVertex(3,  10,  10, 50, 1, 1, 0);

setVertex(4, -10, -10, -50, 0, 0, 1);
setVertex(5,  10, -10, -50, 1, 0, 1);
setVertex(6, -10,  10, -50, 0, 1, 1);
setVertex(7,  10,  10, -50, 1, 1, 1);

setVertex( 8, 50, -10, -10, 0, 0, 3);
setVertex( 9, 50, -10,  10, 1, 0, 3);
setVertex(10, 50,  10, -10, 0, 1, 3);
setVertex(11, 50,  10,  10, 1, 1, 3);

setVertex(12, -50, -10, -10, 0, 0, 4);
setVertex(13, -50, -10,  10, 1, 0, 4);
setVertex(14, -50,  10, -10, 0, 1, 4);
setVertex(15, -50,  10,  10, 1, 1, 4);

// @ts-ignore
let mesh = love.graphics.newMesh(BlockVertexInfo.attributesFormat, byteData, "triangles", "dynamic");
mesh.setTexture(image);

mesh.setVertexMap([
  1, 2, 3,
  3, 4, 2,

  5, 6, 7,
  7, 8, 6,

   9, 10, 11,
  11, 12, 10,

  13, 14, 15,
  15, 16, 14, 
])

const perspectiveMatrix = Mat4.fromPerspective(70, 1280 / 720, 0.01, 1000);
const viewMatrix = Mat4.identity.clone();
viewMatrix.lookAt(new Vec3(0, 0, 0), new Vec3(20, 0, 30));

print(viewMatrix.format());

const shader = love.graphics.newShader("shaders/arrayImage.glsl");
shader.send("project_matrix", "column", perspectiveMatrix.shaderFormat());
shader.send("view_matrix", "column", viewMatrix.shaderFormat());

const color = love.graphics.newCanvas(1280, 720, {
  format: "rgba8",
})

// @ts-ignore
const depth = love.graphics.newCanvas(1280, 720, {
  format: "depth24",
})

const canvas = {[1]: color, depthstencil: depth};

love.update = () => {
  viewMatrix.lookAt(new Vec3(0, 0, 0), new Vec3(math.cos(love.timer.getTime()), 0, math.sin(love.timer.getTime())));
shader.send("view_matrix", "column", viewMatrix.shaderFormat());
}

love.draw = () => {
  love.graphics.setDepthMode("lequal", true)
  // @ts-ignore
  love.graphics.setCanvas(canvas);
  let r, g, b = love.graphics.getBackgroundColor();

  // @ts-ignore
  love.graphics.clear(r, g, b, 1, true, 1);
  
  love.graphics.setShader(shader);
  love.graphics.draw(mesh);
  love.graphics.setShader();
  love.graphics.setCanvas();

  love.graphics.draw(color);
};
