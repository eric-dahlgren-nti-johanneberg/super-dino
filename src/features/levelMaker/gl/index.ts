const defaultShaderType: DefaultShaderType[] = [
  'VERTEX_SHADER',
  'FRAGMENT_SHADER',
];
type DefaultShaderType = 'VERTEX_SHADER' | 'FRAGMENT_SHADER';
// eslint-disable-next-line no-console
const error = console.error;

const errorRE = /ERROR:\s*\d+:(\d+)/gi;
function addLineNumbersWithError(src: string, log = '') {
  // Note: Error message formats are not defined by any spec so this may or may not work.
  const matches = Array.from(log.matchAll(errorRE));
  const lineNoToErrorMap = new Map(
    matches.map((m, ndx) => {
      const lineNo = parseInt(m[0]);
      const next = matches[ndx + 1];
      const end = next ? next.index : log.length;
      const msg = m.index && log.substring(m.index, end);
      return [lineNo - 1, msg];
    })
  );
  return src
    .split('\n')
    .map((line, lineNo) => {
      const err = lineNoToErrorMap.get(lineNo);
      return `${lineNo + 1}: ${line}${err ? `\n\n^^^ ${err}` : ''}`;
    })
    .join('\n');
}

const loadShader = (
  gl: WebGL2RenderingContext,
  shaderSource: string,
  shaderType: number,
  opt_errorCallback?: () => void
) => {
  const errFn = opt_errorCallback || error;
  // Create the shader object
  const shader = gl.createShader(shaderType);

  if (!shader) {
    return errFn('No shader');
  }

  // Load the shader source
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader);

    lastError &&
      errFn(
        `Error compiling shader: ${lastError}\n${addLineNumbersWithError(
          shaderSource,
          lastError
        )}`
      );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

function createProgram(
  gl: WebGL2RenderingContext,
  shaders: WebGLShader[],
  opt_attribs?: string[],
  opt_locations?: number[],
  opt_errorCallback?: () => void
) {
  const errFn = opt_errorCallback || error;
  const program = gl.createProgram();
  if (!program) {
    return errFn('No program');
  }
  shaders.forEach(function (shader) {
    gl.attachShader(program, shader);
  });
  if (opt_attribs) {
    opt_attribs.forEach(function (attrib, ndx) {
      gl.bindAttribLocation(
        program,
        opt_locations ? opt_locations[ndx] : ndx,
        attrib
      );
    });
  }
  gl.linkProgram(program);

  // Check the link status
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program);
    errFn(
      `Error in program linking: ${lastError}\n${shaders
        .map((shader) => {
          const source = gl.getShaderSource(shader);
          const src = source && addLineNumbersWithError(source);
          const type = gl.getShaderParameter(shader, gl.SHADER_TYPE);
          return `${type}:\n${src}`;
        })
        .join('\n')}`
    );

    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export const createProgramFromSources = (
  gl: WebGL2RenderingContext,
  shaderSources: string[],
  opt_attribs?: string[],
  opt_locations?: number[],
  opt_errorCallback?: () => void
) => {
  const shaders = [];
  for (let ii = 0; ii < shaderSources.length; ++ii) {
    const shader = loadShader(
      gl,
      shaderSources[ii],
      gl[defaultShaderType[ii]],
      opt_errorCallback
    );
    shader && shaders.push(shader);
  }
  return createProgram(
    gl,
    shaders,
    opt_attribs,
    opt_locations,
    opt_errorCallback
  );
};
