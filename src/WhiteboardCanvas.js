import {socket} from "./sockets.js";

let selectMoreColors;

export function moreColors(color){
    selectMoreColors = color;
}

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
    const setColor = document.querySelector("#setColor");  

    //Set Size of canvas
    widhtInput.addEventListener("change", e=> {
        ctx.canvas.width = e.target.value;  
        socket.emit("canvasSize", {width:e.target.value, height:canvas.height});             
    });
    heightInput.addEventListener("change", e=> {
        ctx.canvas.height = e.target.value;
        socket.emit("canvasSize", {width: canvas.width, height:e.target.value});               
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

    setColor.addEventListener("click",() => {
        color = selectMoreColors;
    });

    //Set background color
    let backgroundColor = "white";
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    background.addEventListener("click", () => { 
        backgroundColor = color;
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
        startPointY = e.offsetY;      console.log(startPointX);
    };
    const paintStartT = e => {    
        painting = true;
        startPointX = e.touches[0].clientX;console.log(startPointX, e.targetTouches[0].pageX);
        startPointY = e.touches[0].clientY;      
    };

    const paintEnd = e => {
        painting = false;
        rectanglePaint = false;       
    };
    
    //rubber
    const erase = e => {
        canvas.removeEventListener("mousemove", drawCircle);
        canvas.removeEventListener("mousemove", drawRectangle); 
        canvas.removeEventListener("mousemove", drawPencil);
        canvas.removeEventListener("touchmove", drawCircle);
        canvas.removeEventListener("touchmove", drawRectangle); 
        canvas.removeEventListener("touchmove", drawPencil);

        if(painting){
            ctx.beginPath();
            ctx.strokeStyle = backgroundColor;
            ctx.fillStyle = backgroundColor;
            ctx.arc(startPointX, startPointY, 10, 0, Math.PI*2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();  
            startPointX = e.offsetX ? e.offsetX : e.targetTouches[0].pageX;
            startPointY = e.offsetY ? e.offsetY : e.targetTouches[0].pageY;          
        }
        canvas.removeEventListener("mousemove", erase); 
        canvas.addEventListener("mousemove", erase);  
        canvas.removeEventListener("touchmove", erase); 
        canvas.addEventListener("touchmove", erase, {passive: true});  
    };

    //Paint with a pencil, paint a stroke
    const drawPencil = e => {  
        canvas.removeEventListener("mousemove", drawCircle);
        canvas.removeEventListener("mousemove", drawRectangle); 
        canvas.removeEventListener("mousemove", erase);
        canvas.removeEventListener("touchmove", drawCircle);
        canvas.removeEventListener("touchmove", drawRectangle); 
        canvas.removeEventListener("touchmove", erase);
        if(painting){                        
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(startPointX,startPointY);
            e.offsetX ? ctx.lineTo(e.offsetX,e.offsetY) : ctx.lineTo(e.targetTouches[0].pageX,e.targetTouches[0].pageY);            
            ctx.stroke(); 
            ctx.closePath();   
            startPointX = e.offsetX ? e.offsetX : e.targetTouches[0].pageX;
            startPointY = e.offsetY ? e.offsetY : e.targetTouches[0].pageY;
            
            //Emit data
            socket.emit("painting", {
                painting: canvas.toDataURL(),
                room
            });
        }
        canvas.removeEventListener("mousemove", drawPencil);
        canvas.addEventListener("mousemove", drawPencil);  
        canvas.removeEventListener("touchmove", drawPencil);
        canvas.addEventListener("touchmove", drawPencil, {passive: true});      
    };

    let rectangleEndX;
    let rectangleEndY; 

    //draw a rectangle
    const drawRectangle = e => {
        canvas.removeEventListener("mousemove", drawCircle);
        canvas.removeEventListener("mousemove", drawPencil);       
        canvas.removeEventListener("mousemove", erase);
        canvas.removeEventListener("touchmove", drawCircle);
        canvas.removeEventListener("touchmove", drawPencil);       
        canvas.removeEventListener("touchmove", erase);
        if(rectanglePaint){          
            ctx.clearRect(startPointX,startPointY,rectangleEndX,rectangleEndY);
        }
        if(painting){      
            rectanglePaint = true;             
            ctx.strokeStyle = color;
            
            rectangleEndX = e.offsetX ? e.offsetX-startPointX : e.targetTouches[0].pageX-startPointX;
            rectangleEndY = e.offsetY ? e.offsetY-startPointY : e.targetTouches[0].pageY-startPointY;
            ctx.strokeRect(startPointX,startPointY,rectangleEndX,rectangleEndY);            
            
            //Emit data
            socket.emit("painting", {
                painting: canvas.toDataURL(),
                room
            });
        }
        canvas.removeEventListener("mousemove", drawRectangle);
        canvas.addEventListener("mousemove", drawRectangle); 
        canvas.removeEventListener("touchmove", drawRectangle);
        canvas.addEventListener("touchmove", drawRectangle, {passive: true});    
    };

    //Draw a circle
    const drawCircle = e => { 
        canvas.removeEventListener("mousemove", drawRectangle); 
        canvas.removeEventListener("mousemove", drawPencil);       
        canvas.removeEventListener("mousemove", erase);
        canvas.removeEventListener("touchmove", drawRectangle); 
        canvas.removeEventListener("touchmove", drawPencil);       
        canvas.removeEventListener("touchmove", erase);

        if(painting){ 
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            let circleX = e.offsetX ? Math.pow(e.offsetX-startPointX,2) : Math.pow(e.targetTouches[0].pageX-startPointX,2);
            let circleY = e.offsetY ? Math.pow(e.offsetY-startPointY,2) : Math.pow(e.targetTouches[0].pageY-startPointY,2);
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
        canvas.removeEventListener("touchmove", drawCircle);
        canvas.addEventListener("touchmove", drawCircle, {passive: true});
    };

    socket.on("painting", data => { console.log(data);
        if(data && (data.width || data.height)){
            ctx.canvas.width = data.width;
            ctx.canvas.height = data.height;
        }
        if(data && data.painting){ 
            let image = new Image();
            let imageSrc = data.painting;
            image.onload = function(){
                ctx.drawImage(image,0,0);
            };
            image.src = imageSrc; 
        }               
    });

    socket.on("clear", () => {
        ctx.clearRect(0,0,canvas.width,canvas.height);         
    });

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

    socket.emit("getPainting", room);

    canvas.addEventListener("mousedown", paintStart);
    canvas.addEventListener("mouseup", paintEnd);
    
    canvas.addEventListener("touchstart", paintStartT, {passive:true});
    canvas.addEventListener("touchend", paintEnd, {passive:true});
}