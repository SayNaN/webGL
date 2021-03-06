// nextCFD.js (c) July 2017 by alex
// Vertex shader program

window.onload=function(){
    var canvas;
    var gl;
    var backgroundCavas;

    var program = new Object();
    var buffer = new Object();
    var geometry = new Object();

    var body = document.getElementById("content");
    
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    canvas.width = body.clientWidth;
    canvas.height= body.clientHeight;

    backgroundCanvas = document.getElementById("background");
    setbackground(backgroundCanvas);
    
    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas);
    if (!gl) {
	console.log('Failed to get the rendering context for WebGL');
	return;
    }
    if (!initMain(gl,program) ){
	console.log('Error !!!');
	return;
    }
    if (!initFramebufferObject(gl,program) ){
	console.log('Error !!!');
	return;
    };
    if(!initNavigate(gl,program)){
	console.log('Error !!!');
	return;
    }
    if(!initGeometry(gl,program,geometry)){
	console.log('Error !!!');
	return;
    }
    initMatrix(gl,program,geometry);

    // Set the clear color and enable the depth test
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);

    draw(gl,program,geometry,1);

    console.log(program.viewRegion);
    // Register the event handler
    initEventHandlers(gl,canvas,program,geometry);
}

function setbackground(canvas){
    var body = document.getElementById("content");
    canvas.width = body.clientWidth;
    canvas.height= body.clientHeight;

    // Create gradient
    var ctx = canvas.getContext("2d");
    
    var grd=ctx.createLinearGradient(0,0,0,canvas.height);
    grd.addColorStop(0,"rgb(200,200,200)");
    grd.addColorStop(1,"rgb(255,255,255)");

    // Fill with gradient
    ctx.fillStyle=grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function initMatrix(gl,program,geometry){

    program.g_modelMatrix = new Matrix4();
    program.g_modelMatrix.setIdentity();
    program.g_modelMatrix.translate(-geometry.center[0], -geometry.center[1], -geometry.center[2]);
    
    program.g_projMatrix = new Matrix4();
    program.g_projMatrix.setIdentity();

    program.g_viewMatrix = new Matrix4();
    program.g_viewMatrix.setIdentity();
    
    program.g_BviewMatrix = new Matrix4();
    program.g_BviewMatrix.setIdentity();

    program.g_mvpMatrix = new Matrix4();
    program.g_mvpMatrix.setIdentity();

    program.g_BmvpMatrix = new Matrix4();
    program.g_BmvpMatrix.setIdentity();

    program.g_invertMvp = new Matrix4();
    program.g_invertMvp.setIdentity();
    
    program.viewModel = "orthogonal";
    program.viewRegion= initView(gl,geometry);
}

function initView(gl,geometry){
    var opt = new Float32Array(6);
    if((geometry.region[1]-geometry.region[0])/(geometry.region[3]-geometry.region[2])<gl.canvas.width/gl.canvas.height) {
	opt[2] = 1.1*geometry.region[2]-0.1*geometry.region[3];
	opt[3] = 1.1*geometry.region[3]-0.1*geometry.region[2];
	opt[0] = (geometry.region[0]+geometry.region[1])/2-gl.canvas.width/gl.canvas.height*(opt[3]-opt[2])/2;
	opt[1] = (geometry.region[0]+geometry.region[1])/2+gl.canvas.width/gl.canvas.height*(opt[3]-opt[2])/2;
    }
    else{
	opt[0] = 1.1*geometry.region[0]-0.1*geometry.region[1];
	opt[1] = 1.1*geometry.region[1]-0.1*geometry.region[0];
	opt[2] = (geometry.region[2]+geometry.region[3])/2-gl.canvas.width/gl.canvas.height*(opt[1]-opt[0])/2;
	opt[3] = (geometry.region[2]+geometry.region[3])/2+gl.canvas.width/gl.canvas.height*(opt[1]-opt[0])/2;
    }
    opt[4]=-1000;
    opt[5]=1000;
    return opt;
}

function calcMatrix(gl,program){
    var cache = new Matrix4();
    cache.set(program.g_modelMatrix);
    if(program.viewModel == "orthogonal"){
	var opt=program.viewRegion;
	program.g_viewMatrix.setIdentity();
	//program.g_projMatrix.setOrtho(opt[0],opt[1],opt[2],opt[3],opt[4],opt[5]);
	program.g_projMatrix.setOrtho(opt[0],opt[1],opt[2],opt[3],opt[4],opt[5]);
	// Caliculate The model view projection matrix and pass it to u_MvpMatrix
	cache.multiply(program.g_projMatrix);
	program.g_mvpMatrix.set(cache);
	cache.invert();
	program.g_invertMvp.set(cache);
    }
    else if(program.viewModel == "perspective") {
	var cache_B = new Matrix4();
	cache_B.set(program.g_modelMatrix);
	program.g_projMatrix.perspective(30.0, gl.canvas.width/gl.canvas.height, 1.0, 100.0);
	program.g_viewMatrix.lookAt(0.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0);
	program.g_BviewMatrix.lookAt(0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0);
	
	cache.multiply(program.g_viewMatrix);
	cache.multiply(program.g_projMatrix);
	
	cache_B.multiply(program.g_BviewMatrix);
	cache_B.multiply(program.g_projMatrix);
	
	program.g_mvpMatrix.set(cache);
	program.g_BmvpMatrix.set(cache_B);
	cache.invert();
	program.g_invertMvp.set(cache);
    }
}

function draw(gl,program,geometry,mark) {
    calcMatrix(gl,program);
    
    drawGeometry(gl,program,geometry);

    if(mark){
	drawFrame(gl,program,geometry);
    }
    
    //var pixels = new Uint8Array(4); // Array for storing the pixel value
    //gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    //gl.readPixels(gl.canvas.width/2, gl.canvas.height/2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    //console.log("pixels",pixels);
}
