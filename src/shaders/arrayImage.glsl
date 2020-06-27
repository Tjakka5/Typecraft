#pragma language glsl3

varying vec3 passTexCoord;

#ifdef VERTEX

uniform mat4 project_matrix;
uniform mat4 view_matrix;

uniform vec3 chunkPosition;

vec4 position(mat4 transformProjection, vec4 inVertexData) {
  uint data = floatBitsToUint(inVertexData.x);

  uint x = (data & 0x1Fu);
	uint y = (data >> 5u) & 0x1Fu;
	uint z = (data >> 10u) & 0x1Fu;

  uint u = (data >> 15u) & 0x1u;
  uint v = (data >> 16u) & 0x1u;
  uint layer = (data >> 17u) & 0xFu;

  passTexCoord = vec3(u * x, v * y, layer);

  vec4 position = vec4(x + chunkPosition.x, y + chunkPosition.y, z + chunkPosition.z, 1.0f);

	return project_matrix * view_matrix * position;
}
#endif

#ifdef PIXEL
uniform ArrayImage MainTex;

void effect() {
  vec4 sample = Texel(MainTex, passTexCoord);

  if (sample.a == 0)
    discard;

  love_PixelColor = sample * VaryingColor;
}
#endif