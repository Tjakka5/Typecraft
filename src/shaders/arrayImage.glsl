#pragma language glsl3

#ifdef VERTEX
uniform mat4 project_matrix;
uniform mat4 view_matrix;

vec4 position(mat4 transformProjection, vec4 vertexPosition) {
	return project_matrix * view_matrix * vertexPosition;
}
#endif

#ifdef PIXEL
uniform ArrayImage MainTex;

void effect() {
  love_PixelColor = Texel(MainTex, VaryingTexCoord.xyz) * VaryingColor;
}
#endif