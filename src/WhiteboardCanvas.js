import {socket} from "./sockets.js";


export default function canvas(canvas,room){

    if(!canvas){
        return;
    }    
           
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = 1000;
    ctx.canvas.height = 600;    
    
    const pencil = document.querySelector("#pencil");
    const rectangle = document.querySelector("#rectangle");
    const circle = document.querySelector("#circle");
    const clear = document.querySelector("#clear");
    const rubber = document.querySelector("#rubber");
    const background = document.querySelector("#background");
    const download = document.querySelector("#download");
    const widhtInput = document.querySelector("#inputWidth");
    const heightInput = document.querySelector("#inputHeight");
    const colorOutput = document.querySelector("#colorOutput");    

    //Set Size of canvas
    widhtInput.addEventListener("change", e=> {
        ctx.canvas.width = e.target.value;  
        socket.emit("canvasSize", {width:e.target.value, height:canvas.height});             
    });
    heightInput.addEventListener("change", e=> {
        ctx.canvas.height = e.target.value;
        socket.emit("canvasSize", {width: canvas.width, height:e.target.value});               
    });

    socket.on("canvasSize", data => {
        ctx.canvas.width = data.width;
        ctx.canvas.height = data.height;
    });
    
    //Change Color
    let color = "black";
    const colorButtons = document.querySelectorAll(".color");
    const changeColor = e => { 
        color = e.target.attributes[2].value;
    };
    colorButtons.forEach(item=> {
        item.addEventListener("click", changeColor);
    });  

    //Set background color
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    background.addEventListener("click", () => { 
        ctx.fillStyle = color;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    });

    //Clear canvas
    clear.addEventListener("click", () => {       
        socket.emit("clear", room);
    });    

    //Paint
    let painting = false;
    let rectanglePaint = false;
    let startPointX;
    let startPointY;

    const paintStart = e => {      
        painting = true;
        startPointX = e.offsetX;
        startPointY = e.offsetY;        
    };

    const paintEnd = () => {
        painting = false;
        rectanglePaint = false;        
    };
    
    //rubber
    const erase = e => {
        canvas.removeEventListener("mousemove", drawCircle);
        canvas.removeEventListener("mousemove", drawRectangle); 
        canvas.removeEventListener("mousemove", drawPencil);

        if(painting){
            startPointX = e.offsetX;
            startPointY = e.offsetY;
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.fillStyle = "white";
            ctx.arc(startPointX, startPointY, 10, 0, Math.PI*2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();            
        }
        canvas.removeEventListener("mousemove", erase); 
        canvas.addEventListener("mousemove", erase);        
    };

    //Paint with a pencil, paint a stroke
    const drawPencil = e => {    
        canvas.removeEventListener("mousemove", drawCircle);
        canvas.removeEventListener("mousemove", drawRectangle); 
        canvas.removeEventListener("mousemove", erase);
        if(painting){                        
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(startPointX,startPointY);
            ctx.lineTo(e.offsetX,e.offsetY);            
            ctx.stroke(); 
            ctx.closePath();   
            startPointX = e.offsetX;
            startPointY = e.offsetY;
            
            //Emit data
            socket.emit("painting", {
                painting: canvas.toDataURL(),
                room
            });
        }
        canvas.removeEventListener("mousemove", drawPencil);
        canvas.addEventListener("mousemove", drawPencil);        
    };

    let rectangleEndX;
    let rectangleEndY; 

    //draw a rectangle
    const drawRectangle = e => {
        canvas.removeEventListener("mousemove", drawCircle);
        canvas.removeEventListener("mousemove", drawPencil);       
        canvas.removeEventListener("mousemove", erase);
        if(rectanglePaint){          
            ctx.clearRect(startPointX,startPointY,rectangleEndX,rectangleEndY);
        }
        if(painting){      
            rectanglePaint = true;             
            ctx.strokeStyle = color;
            rectangleEndX = e.offsetX-startPointX;
            rectangleEndY = e.offsetY-startPointY;
            ctx.strokeRect(startPointX,startPointY,rectangleEndX,rectangleEndY);            
            
            //Emit data
            socket.emit("painting", {
                painting: canvas.toDataURL(),
                room
            });
        }
        canvas.removeEventListener("mousemove", drawRectangle);
        canvas.addEventListener("mousemove", drawRectangle);     
    };

    //Draw a circle
    const drawCircle = e => {
        canvas.removeEventListener("mousemove", drawRectangle); 
        canvas.removeEventListener("mousemove", drawPencil);       
        canvas.removeEventListener("mousemove", erase);

        if(painting){ 
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            let circleX = Math.pow(e.offsetX-startPointX,2);
            let circleY = Math.pow(e.offsetY-startPointY,2);
            let line = Math.sqrt(circleX+circleY); 
            ctx.arc(startPointX, startPointY, line, 0, Math.PI*2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            
            //Emit data
            socket.emit("painting", {
                painting: canvas.toDataURL(),
                room
            });
        }
        canvas.removeEventListener("mousemove", drawCircle);
        canvas.addEventListener("mousemove", drawCircle);
    };

    socket.on("painting", data => { 
        if(data){ 
            let image = new Image();
            let imageSrc = data.painting;
            image.onload = function(){
                ctx.drawImage(image,0,0);
            };
            image.src = imageSrc; 
        }               
    });

    socket.on("clear", () => {
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);         
    });

    socket.emit("getPainting", room);

    pencil.addEventListener("click", drawPencil);
    rectangle.addEventListener("click", drawRectangle);
    circle.addEventListener("click", drawCircle);
    rubber.addEventListener("click", erase);

    const downloadFile = () => {
        download.download="loomchat";
        download.href = canvas.toDataURL("image/jpeg",1);
        download.target="_blank";
    };

    download.addEventListener("click",downloadFile);

    canvas.addEventListener("mousedown", paintStart);
    canvas.addEventListener("mouseup", paintEnd);
}