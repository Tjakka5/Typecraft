#pragma language glsl3

flat varying int data;

#ifdef VERTEX

uniform mat4 project_matrix;
uniform mat4 view_matrix;

vec4 position(mat4 transformProjection, vec4 vertexPosition) {
  data = floatBitsToInt(vertexPosition.x);

  float x = data & 0x1F;
	float y = (data >> 5) & 0x1F;
	float z = (data >> 10) & 0x1F;

  vec4 position = vec4(x, y, z, 1.0f);

	return project_matrix * view_matrix * position;
}
#endif

#ifdef PIXEL
uniform ArrayImage MainTex;

float int2_t_to_float(int i) {
	return float(i & 0xff) / 255.0;
}

void effect() {
  float r = data & 0xff;
	float g = (data >> 8) & 0xff00;
	float b = (data >> 16) & 0xff0000;

  love_PixelColor = Texel(MainTex, vec3(1, 1, r)) * VaryingColor;
	
  
  /*
  float x = float(_inVertexData & 0x3u);
  float y = float((_inVertexData & 0xCu) >> 2u);
  float z = float((_inVertexData & 0x30u) >> 4u);

  //love_PixelColor = Texel(MainTex, vec3(1, 1, x)) * VaryingColor;
  love_PixelColor = vec4(foo / 5, foo / 5, foo / 5, 1);
  */
}
#endif