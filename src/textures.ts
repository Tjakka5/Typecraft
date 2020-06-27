const textures = love.graphics.newArrayImage([
  "assets/tiles/stone.png",
  "assets/tiles/wood.png",
  "assets/tiles/brick_red.png",
  "assets/tiles/cotton_blue.png",
  "assets/tiles/cotton_red.png",
  "assets/tiles/cotton_green.png",
  "assets/tiles/cotton_tan.png",
  "assets/tiles/leaves_transparent.png",
], {
  mipmaps: true,
});
textures.setWrap("repeat", "repeat");

export default textures;