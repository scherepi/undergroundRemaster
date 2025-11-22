// written by guac in november of 2025 with ample help from the MDN docs
// earn money lives forever
main();
      // WebGL code to bring the beautiful Earn Money to life.
      function main() {
        const canvas = document.getElementById('earnmoney-canvas');
        const gl = canvas.getContext('webgl');

        if (gl === null) {
          // WebGL is not available or not working. we'll just put the flat image of Earn Money. it'll have to do...
          canvas.remove();
          const img = document.createElement('img');
          img.setAttribute('src', 'imgs/earnmoney.png');
          img.setAttribute('height', 445);
          img.setAttribute('width', 475);
          document.getElementById("earnmoney-content").append(img);
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // set clear color to fully opaque black
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Vertex shader program
        const vsSource = `
            attribute vec4 aVertexPosition;
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            void main() {
              gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            }`;
        const fsSource = `void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }`
        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        // collect all the info we need for the shader program
        const programInfo = {
          program: shaderProgram,
          attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
          },
          uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
          },
        };
      }
      function initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert(`Unable to intitialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
          return null;
        }

        return shaderProgram;
      }
      function loadShader(gl, type, source) {
        const shader = gl.createShader(type); // create the shader object of the given type (vertex or fragment)
        gl.shaderSource(shader, source);      // set the source code of the shader to the source code we're specifying
        gl.compileShader(shader);             // attempt to compile this source code for the shader!
        // check that the shader compiled smoothly and provide an error message otherwise
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
          gl.deleteShader(shader); // abort and delete the shader if we ran into an issue
          return null;
        }
        return shader;
      }