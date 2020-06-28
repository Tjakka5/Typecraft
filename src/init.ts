import Mat4 from "classes/mat4";
import Vec3 from "classes/vec3";
import Chunk from "classes/chunk";

const chunk = new Chunk(new Vec3(0, 0, 0));

love.graphics.setBackgroundColor(0.5, 0.5, 0.5);

const perspectiveMatrix = Mat4.fromPerspective(70, 1280 / 720, 0.01, 1000);
const viewMatrix = Mat4.identity.clone();

viewMatrix.lookAt(new Vec3(0, 0, 0), new Vec3(20, 0, 30));

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

let t = 0;

love.update = () => {
  if (love.keyboard.isDown("q")) {
    t += love.timer.getDelta();
  }
  if (love.keyboard.isDown("e")) {
    t -= love.timer.getDelta();
  }

  viewMatrix.lookAt(new Vec3(0, 0, 0), new Vec3(math.cos(t), 0, math.sin(t)));
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
  chunk.renderAlphaBit(shader);
  love.graphics.setShader();
  love.graphics.setCanvas();

  love.graphics.draw(color);
};
