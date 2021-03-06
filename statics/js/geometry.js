// geometry.js (c) July 2017 by alex
// read Json and gen arrays

function initGeometry(gl,program,geometry) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    geometry.faceNum = 6;

    geometry.surface = new Float32Array([ 1.0, 1.0, 1.0,  0.0, 0.0, 1.0,
					 -1.0, 1.0, 1.0,  0.0, 0.0, 1.0,
					 -1.0,-1.0, 1.0,  0.0, 0.0, 1.0, 

					  1.0, 1.0, 1.0,  0.0, 0.0, 1.0,
					  -1.0,-1.0, 1.0,  0.0, 0.0, 1.0,
					  1.0,-1.0, 1.0,  0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
					  
					  1.0, 1.0, 1.0,  1.0, 0.0, 0.0,
					  1.0,-1.0, 1.0,  1.0, 0.0, 0.0,
					  1.0,-1.0,-1.0,  1.0, 0.0, 0.0,

					  1.0, 1.0, 1.0,  1.0, 0.0, 0.0,
					  1.0,-1.0,-1.0,  1.0, 0.0, 0.0,
					  1.0, 1.0,-1.0,  1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
					  
					  1.0, 1.0, 1.0,  0.0, 1.0, 0.0,
					  1.0, 1.0,-1.0,  0.0, 1.0, 0.0,
					  -1.0, 1.0,-1.0,  0.0, 1.0, 0.0,

					  1.0, 1.0, 1.0,  0.0, 1.0, 0.0,
					  -1.0, 1.0,-1.0,  0.0, 1.0, 0.0,
					 -1.0, 1.0, 1.0,  0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
					  
					 -1.0, 1.0, 1.0, -1.0, 0.0, 0.0,
					 -1.0, 1.0,-1.0, -1.0, 0.0, 0.0,
					  -1.0,-1.0,-1.0, -1.0, 0.0, 0.0,

					  -1.0, 1.0, 1.0, -1.0, 0.0, 0.0,
					  -1.0,-1.0,-1.0, -1.0, 0.0, 0.0,
					  -1.0,-1.0, 1.0, -1.0, 0.0, 0.0,// v1-v6-v7-v2 left
					  
					  -1.0,-1.0,-1.0,  0.0,-1.0, 0.0,
					  1.0,-1.0,-1.0,  0.0,-1.0, 0.0,
					  1.0,-1.0, 1.0,  0.0,-1.0, 0.0,

					  -1.0,-1.0,-1.0,  0.0,-1.0, 0.0,
					  1.0,-1.0, 1.0,  0.0,-1.0, 0.0,
					 -1.0,-1.0, 1.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down

					  1.0,-1.0,-1.0,  0.0, 0.0,-1.0,
					 -1.0,-1.0,-1.0,  0.0, 0.0,-1.0,
					  -1.0, 1.0,-1.0,  0.0, 0.0,-1.0,
					  
					  1.0,-1.0,-1.0,  0.0, 0.0,-1.0,
					  -1.0, 1.0,-1.0,  0.0, 0.0,-1.0,
					  1.0, 1.0,-1.0,  0.0, 0.0,-1.0]);     // v4-v7-v6-v5 back

    geometry.line = new Float32Array([ 1.0, 1.0, 1.0,
				      -1.0, 1.0, 1.0,
				      -1.0, 1.0, 1.0,
				      -1.0,-1.0, 1.0,
				      -1.0,-1.0, 1.0,
				       1.0,-1.0, 1.0,
				       1.0,-1.0, 1.0,
				       1.0, 1.0, 1.0,  // v0-v1-v2-v3 front
				       
				       1.0, 1.0, 1.0,
				       1.0,-1.0, 1.0,
				       1.0,-1.0, 1.0,
				       1.0,-1.0,-1.0,
				       1.0,-1.0,-1.0,
				       1.0, 1.0,-1.0,
				       1.0, 1.0,-1.0,
				       1.0, 1.0, 1.0,  // v0-v3-v4-v5 right
				       
				       1.0, 1.0, 1.0,
				       1.0, 1.0,-1.0,
				       1.0, 1.0,-1.0,
				       -1.0, 1.0,-1.0,
				       -1.0, 1.0,-1.0,
				       -1.0, 1.0, 1.0,
				       -1.0, 1.0, 1.0,
				       1.0, 1.0, 1.0,     // v0-v5-v6-v1 up
				       
				       -1.0, 1.0, 1.0,
				       -1.0, 1.0,-1.0,
				       -1.0, 1.0,-1.0,
				       -1.0,-1.0,-1.0,
				       -1.0,-1.0,-1.0,
				       -1.0,-1.0, 1.0,
				       -1.0,-1.0, 1.0,
				       -1.0, 1.0, 1.0,     // v1-v6-v7-v2 left
				       
				       -1.0,-1.0,-1.0,
				       1.0,-1.0,-1.0,
				       1.0,-1.0,-1.0,
				       1.0,-1.0, 1.0,
				       1.0,-1.0, 1.0,
				       -1.0,-1.0, 1.0,
				       -1.0,-1.0, 1.0,
				       -1.0,-1.0,-1.0,     // v7-v4-v3-v2 down
				       
				       1.0,-1.0,-1.0,
				       -1.0,-1.0,-1.0,
				       -1.0,-1.0,-1.0,
				       -1.0, 1.0,-1.0,
				       -1.0, 1.0,-1.0,
				       1.0, 1.0,-1.0,
				       1.0, 1.0,-1.0,
				       1.0,-1.0,-1.0]);     // v4-v7-v6-v5 back

    geometry.region = new Float32Array([-1.0, 1.0, -1.0, 1.0, -1.0, 1.0]);
    geometry.center = new Float32Array([0.0, 0.0, 0.0]);
    
    //Indices_Count.splice(0,Indices_Count.length);
    geometry.lineOffset = new Int8Array([0, 8, 16, 24, 32, 40]);
    geometry.lineCount = new Int8Array([8, 8, 8, 8, 8, 8]);

    geometry.surfOffset = new Int8Array([0, 6, 12, 18, 24, 30]);
    geometry.surfCount = new Int8Array([6, 6, 6, 6, 6, 6]);

    //facePicked.splice(0,facePicked.length);
    program.facePicked = new Int8Array([0, 0, 0, 0, 0, 0]);
    program.faceCoverd = 0;

    program.visible = new Int8Array([1, 1, 1, 1, 1, 1]);

    program.viewRegion = new Float32Array(6);

    program.rotateCenter = new Float32Array([0.0, 0.0, 0.0]);

    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, program.main.surfBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.surface, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, program.main.lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.line, gl.STATIC_DRAW);

    return true;
}