// event.js (c) July 2017 by alex
// event handler javascript file

// z axis out screen (1,1,1) coor and axis coor
var z_out = new Float32Array([ 1.0, 1.0, 1.0,
			       2/3,-1/3,-1/3,
			       1.0, 0.0, 0.0]);

var z_outM= new Matrix4(new Float32Array([ 1.0, 0.0, 0.0, 0.0,
					   0.0, 1.0, 0.0, 0.0,
					   0.0, 0.0, 1.0, 0.0,
					   0.0, 0.0, 0.0, 1.0]));

// z axis in screen (1,1,1) coor and axis coor
var z_in  = new Float32Array([-1.0, 1.0,-1.0,
			      -2/3,-1/3, 1/3,
			      -1.0, 0.0, 0.0]);

var z_inM = new Matrix4(new Float32Array([-1.0, 0.0, 0.0, 0.0,
					   0.0, 1.0, 0.0, 0.0,
					   0.0, 0.0,-1.0, 0.0,
					   0.0, 0.0, 0.0, 1.0]));

// x axis out screen (1,1,1) coor and axis coor
var x_out = new Float32Array([-1.0, 1.0, 1.0,
			       1/3,-1/3, 2/3,
			       0.0, 0.0, 1.0]);

var x_outM= new Matrix4(new Float32Array([ 0.0, 0.0, 1.0, 0.0,
					   0.0, 1.0, 0.0, 0.0,
					  -1.0, 0.0, 0.0, 0.0,
					   0.0, 0.0, 0.0, 1.0]));

// x axis in screen (1,1,1) coor and axis coor
var x_in  = new Float32Array([ 1.0, 1.0,-1.0,
			      -1/3,-1/3,-2/3,
			       0.0, 0.0,-1.0]);

var x_inM = new Matrix4(new Float32Array([ 0.0, 0.0,-1.0, 0.0,
					   0.0, 1.0, 0.0, 0.0,
					   1.0, 0.0, 0.0, 0.0,
					   0.0, 0.0, 0.0, 1.0]));

// y axis out screen (1,1,1) coor and axis coor
var y_out = new Float32Array([ 1.0,-1.0, 1.0,
			       2/3, 1/3,-1/3,
			       1.0, 0.0, 0.0]);

var y_outM= new Matrix4(new Float32Array([ 1.0, 0.0, 0.0, 0.0,
					   0.0, 0.0, 1.0, 0.0,
					   0.0,-1.0, 0.0, 0.0,
					   0.0, 0.0, 0.0, 1.0]));

// y axis in screen (1,1,1) coor and axis coor
var y_in  = new Float32Array([ 1.0, 1.0,-1.0,
			       2/3,-1/3, 1/3,
			       1.0, 0.0, 0.0]);

var y_inM = new Matrix4(new Float32Array([ 1.0, 0.0, 0.0, 0.0,
					   0.0, 0.0,-1.0, 0.0,
					   0.0, 1.0, 0.0, 0.0,
					   0.0, 0.0, 0.0, 1.0]));

var requestID;

function initEventHandlers(gl,canvas,program,geometry)
{
    var mousedown = false;
    var dragging = false;         // Dragging or not
    var covering = false;
    var lastX = -1, lastY = -1;   // Last position of the mouse
    var pixels   = new Uint8Array(4); // Array for storing the pixel value
    var depthPix = new Uint8Array(4);
    var zcoor;
    var faceID;

    $.ev.add(canvas, "dblclick", function(){
	$("#paramform").fadeIn();
    });

    $.ev.add(document.getElementById("btn-confirm"),"click",function(){
	$("#paramform").fadeOut();
    });


    if(canvas.addEventListener){
	canvas.addEventListener("mousedown",function(ev) {   // Mouse is pressed
		var x = ev.clientX, y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
		    mousedown = true;
		}
	    },false);

	canvas.addEventListener("mouseup",function(ev){
		var x = ev.clientX, y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		mousedown = false;
		if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom && dragging == false ) {
		    gl.bindFramebuffer(gl.FRAMEBUFFER , program.framebuffer);
		    gl.readPixels(x-rect.left, rect.bottom-y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		    console.log(pixels);
		    if(pixels[0]<200 && pixels[1]<200 && pixels[2]==0){
			faceID=pixels[0]+pixels[1]*200;
			if(faceID>0){
			    program.facePicked[faceID-1]= (program.facePicked[faceID-1]+1)%2;
			    program.faceCoverd = faceID;
			    // Start dragging if a moue is in <canvas>
			    draw(gl,program,geometry,0);
			}
		    }
		    else if(pixels[0]==255 && pixels[1]==0 && pixels[2]==0) {
			program.faceCoverd = 0;
			if(program.g_modelMatrix.isEquel(x_outM)){
			    animateChange(gl,program,geometry,x_in,x_inM);
			}
			else{
			    animateChange(gl,program,geometry,x_out,x_outM);
			}
		    }
		    else if(pixels[0]==0 && pixels[1]==255 && pixels[2]==0) {
			program.faceCoverd = 0;
			if(program.g_modelMatrix.isEquel(y_outM)){
			    animateChange(gl,program,geometry,y_in,y_inM);
			}
			else{
			    animateChange(gl,program,geometry,y_out,y_outM);
			}
		    }
		    else if(pixels[0]==0 && pixels[1]==0 && pixels[2]==255) {
			program.faceCoverd = 0;
			if(program.g_modelMatrix.isEquel(z_outM)){
			    animateChange(gl,program,geometry,z_in,z_inM);
			}
			else{
			    animateChange(gl,program,geometry,z_out,z_outM);
			}
		    }
		    
		}
		dragging = false;  
	    },false); // Mouse is released
	
	canvas.addEventListener("mouseleave",function(ev){
		dragging = false;
	    },false);
	
	canvas.addEventListener("mousemove", function(ev) { // Mouse is moved
		var x = ev.clientX, y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
		    gl.bindFramebuffer(gl.FRAMEBUFFER , program.framebuffer);
		    gl.readPixels(x-rect.left, rect.bottom-y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		    if(pixels[0]<200 && pixels[1]< 200 && pixels[2] == 0){
			faceID=pixels[0]+pixels[1]*200;
			program.faceCoverd = faceID;
		    }
		    else if(pixels[0]==255 && pixels[1]==0 && pixels[2]==0) {
			program.faceCoverd = -1;
		    }
		    else if(pixels[0]==0 && pixels[1]==255 && pixels[2]==0) {
			program.faceCoverd = -2;
		    }
		    else if(pixels[0]==0 && pixels[1]==0 && pixels[2]==255) {
			program.faceCoverd = -3;
		    }
		    else{
			program.faceCoverd = 0;
		    }
		    draw(gl,program,geometry,0);
		    if (mousedown) {
			dragging = true;
			var factor = 100/canvas.height; // The rotation ratio
			var dx = factor * (x - lastX);
			var dy = factor * (y - lastY);
			// Limit x-axis rotation angle to -90 to 90 degrees
			//currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
			//currentAngle[1] = currentAngle[1] + dx;
			program.g_modelMatrix.rotate(dy, 1.0, 0.0, 0.0); // Rotation around x-axis
			program.g_modelMatrix.rotate(dx, 0.0, 1.0, 0.0); // Rotation around y-axis
			draw(gl,program,geometry,1);
		    }
		}else{
		    dragging=false;
		    program.faceCoverd = 0;
		}
		lastX = x; lastY = y;
	    },false);
	
	canvas.addEventListener("wheel", function(ev) { // Mouse is moved
		var z = ev.deltaY;
		console.log('ev.deltaY',z);
		var rect = ev.target.getBoundingClientRect();
		var x = ev.clientX-rect.left;
		var y = rect.bottom-ev.clientY;
		var transX,transY;
		if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
		    var modelWidth  = program.viewRegion[1]-program.viewRegion[0];
		    var modelHeight = program.viewRegion[3]-program.viewRegion[2];
		    if(z>0){
			transX = (x/gl.canvas.width - 0.5)*modelWidth /5;
			transY = (y/gl.canvas.height- 0.5)*modelWidth /5;
			program.g_modelMatrix.translate(-transX,-transY,0);
			for(var i=0;i<4;i++){
			    program.viewRegion[i] = 0.8 * program.viewRegion[i];
			}
		    }
		    else{
			transX = (x/gl.canvas.width - 0.5)*modelWidth /4;
			transY = (y/gl.canvas.height- 0.5)*modelWidth /4;
			program.g_modelMatrix.translate(transX,transY,0);
			for(var i=0;i<4;i++){
			    program.viewRegion[i] = 1.25 * program.viewRegion[i];
			}
		    }
		    draw(gl,program,geometry,1);
		}
	    },false);
	window.addEventListener("resize", function(ev) {
	    var cache1,cache2;
	    var backgroundCanvas = document.getElementById("background");
	    setbackground(backgroundCanvas);
	    var body = document.getElementById("content");
	    gl.canvas.width = body.clientWidth;
	    gl.canvas.height= body.clientHeight;
	    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	    if(gl.canvas.width>gl.canvas.height){
		cache1 = (program.viewRegion[0]+program.viewRegion[1])/2;
		cache2 = (program.viewRegion[3]-program.viewRegion[2]) * gl.canvas.width / gl.canvas.height / 2;
		program.viewRegion[0] = cache1 - cache2;
		program.viewRegion[1] = cache1 + cache2;
		//console.log('1');
	    }
	    else {
		cache1 = (program.viewRegion[2]+program.viewRegion[3])/2;
		cache2 = (program.viewRegion[1]-program.viewRegion[0]) * gl.canvas.height / gl.canvas.width / 2;
		program.viewRegion[2] = cache1 - cache2;
		program.viewRegion[3] = cache1 + cache2;
		//console.log('2');
	    }
	    draw(gl,program,geometry,1);
	},true);
    }
    /*else{
	canvas.attachEvent("onmousedown",function(ev) {   // Mouse is pressed
		var x = ev.clientX, y = ev.clientY;
		// Start dragging if a moue is in <canvas>
		var rect = ev.target.getBoundingClientRect();
		if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
		    lastX = x; lastY = y;
		    dragging = true;
		}
	    });
	    
	canvas.attachEvent("onmouseout",function(ev){
		dragging=false;
	    });
	
	canvas.attachEvent("onmouseup",function(ev){
		    dragging = false;  
		}); // Mouse is released
	    
	canvas.attachEvent("onmousemove", function(ev) { // Mouse is moved
		var x = ev.clientX, y = ev.clientY;
		if (dragging) {
		    var factor = 100/canvas.height; // The rotation ratio
		    var dx = factor * (x - lastX);
		    var dy = factor * (y - lastY);
		    // Limit x-axis rotation angle to -90 to 90 degrees
		    //currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
		    //currentAngle[1] = currentAngle[1] + dx;
		    currentAngle[0] += dy;
		    currentAngle[1] += dx;
		}
		lastX = x, lastY = y;
	    });
	
	canvas.attachEvent("onwheel", function(ev) { // Mouse is moved
		var y = ev.deltaY;
		if(y>0){
		    currentScale *= 1.25;
		}
		else{
		    currentScale *= 0.8;
		}
	    });
	    }*/
}

function animateChange(gl,program,geometry,aim,aimMatrix){
    var stepNum =30;
    var offset = new Vector3();
    var center = new Vector4();
    var revolutionAxis = new Vector4();
    var rotationAxis   = new Vector4();
    var revolutionAngle,rotationAngle;
    var onceThrow = new Matrix4();
    var view = new Float32Array(6);
    
    onceThrow.set(program.g_modelMatrix);

    offset.elements[0] = onceThrow.elements[12]/stepNum;
    offset.elements[1] = onceThrow.elements[13]/stepNum;
    offset.elements[2] = onceThrow.elements[14]/stepNum;

    onceThrow.elements[12]=0.0;
    onceThrow.elements[13]=0.0;
    onceThrow.elements[14]=0.0;

    center=onceThrow.multiplyVector4(new Vector4([1.0, 1.0, 1.0, 1.0]));

    revolutionAxis = center.cross(new Vector4([aim[0],aim[1],aim[2],1.0]));

    // **************************
    // calculate revolution angle
    revolutionAngle = center.getIncludedAngle(new Vector4([aim[0],aim[1],aim[2],1.0])) / stepNum;
    // **************************

    onceThrow.rotate(revolutionAngle*stepNum,revolutionAxis.elements[0],revolutionAxis.elements[1],revolutionAxis.elements[2]);
    
    center=onceThrow.multiplyVector4(new Vector4([1.0, 0.0, 0.0, 1.0]));

    center.substraction(new Vector4([aim[0]/3,aim[1]/3,aim[2]/3, 1.0]));

    // ************************
    // calculate rotation angle
    rotationAngle   = center.getIncludedAngle(new Vector4([aim[3],aim[4],aim[5],1.0])) / stepNum;
    // ************************

    onceThrow.rotate(rotationAngle*stepNum,aim[0],aim[1],aim[2]);

    center=onceThrow.multiplyVector4(new Vector4([1.0, 0.0, 0.0, 1.0]));
    
    if(!center.isCloser(new Vector4([aim[6],aim[7],aim[8],1.0]))){
	rotationAngle *= -1;
    }
    var i=1;
    requestID = requestAnimationFrame(function fn(){
	    if(i<=stepNum){
		program.g_modelMatrix.elements[12]=0.0;
		program.g_modelMatrix.elements[13]=0.0;
		program.g_modelMatrix.elements[14]=0.0;
		program.g_modelMatrix.rotate(revolutionAngle,revolutionAxis.elements[0],revolutionAxis.elements[1],revolutionAxis.elements[2]);
		rotationAxis = program.g_modelMatrix.multiplyVector4(new Vector4([1.0, 1.0, 1.0, 1.0]));
		
		program.g_modelMatrix.rotate(rotationAngle, rotationAxis.elements[0],rotationAxis.elements[1],rotationAxis.elements[2]);
		program.g_modelMatrix.translate(offset.elements[0]*(stepNum-i),offset.elements[1]*(stepNum-i),offset.elements[2]*(stepNum-i));
		view = initView(gl,geometry);
		for(var j=0;j<4;j++){
		    program.viewRegion[j] = (view[j]-program.viewRegion[j])/stepNum*i+program.viewRegion[j];
		}
		draw(gl,program,geometry,1);
		i++;
		requestID = requestAnimationFrame(fn);
	    }else{
		program.g_modelMatrix.set(aimMatrix);
		draw(gl,program,geometry,1);
		cancelAnimationFrame(requestID);
	    }
	});
}

