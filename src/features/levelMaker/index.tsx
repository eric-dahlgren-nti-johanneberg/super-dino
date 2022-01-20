import React, { FC } from 'react';

import Canvas from './components/canvas';
import * as webglUtils from './gl';
import { rotation } from './gl/m3';
import { CanvasDrawFn } from './types';

const vs = `#version 300 es
in vec4 a_position;

void main() {
  // Multiply the position by the matrix.
  gl_Position = a_position;
}
`;

const fs = `#version 300 es
precision highp float;

uniform vec4 u_color;
uniform vec2 u_mouse;

out vec4 outColor;

void main() {
   outColor = vec4(1.0 / u_mouse.x, 0, 0, 1.0);
}
`;

const initGl = (gl: WebGL2RenderingContext) => {
  // setup GLSL program
  const program = webglUtils.createProgramFromSources(gl, [
    vs,
    fs,
  ]) as WebGLProgram;

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  // lookup uniforms
  const colorLocation = gl.getUniformLocation(program, 'u_color');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

  // Create a buffer and put a 2 points in it for 1 line
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // three points
  const positions = [0, 0, 0, 0.5, 0.7, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  return {
    program,
    colorLocation,
    matrixLocation,
    mouseLocation,
    vao,
  };
};

const LevelMaker: FC = () => {
  const draw: CanvasDrawFn = (gl, frame, mouse) => {
    const { colorLocation, matrixLocation, mouseLocation, program, vao } =
      initGl(gl);
    frame *= 0.001;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Compute the matrices
    const matrix = rotation(-frame);

    const width = gl.canvas.clientHeight;
    const heigth = gl.canvas.clientWidth;

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    gl.uniform2f(mouseLocation, width / mouse[0], heigth / mouse[1]);

    // Draw in * Fabulous *
    gl.uniform4fv(colorLocation, [
      Math.sin(frame),
      Math.cos(frame),
      Math.sin(frame),
      1,
    ]);

    // Draw the line
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
  };

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1>Canvas</h1>
      <Canvas
        draw={draw}
        className='aspect-video max-w-screen-lg m-auto cursor-auto border-[1px] border-slate-600 border-solid w-full'
      />
    </section>
  );
};

export default LevelMaker;
