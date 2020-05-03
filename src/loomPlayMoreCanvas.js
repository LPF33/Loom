export default function canvas(canvas){
    const ctx = canvas.getContext("2d"); 
    let x;
    let ballX;
    let sinusCurve = [];
    let imageSrc =  "/logowhite.png";
    let imageSrcYellow = "/logoyellow.png";
    let timeoutId;

    const drawPicture = () => {
        let image = new Image();
        image.onload = function(){
            ctx.drawImage(image,0,canvas.height/2-0.5*canvas.width/7,canvas.width/10,canvas.width/7);
            ctx.drawImage(image,canvas.width-canvas.width/10,canvas.height/2-0.5*canvas.width/7,canvas.width/10,canvas.width/7);
        };
        image.src = imageSrc;           
    };

    const shootBall = () => {
        ctx.clearRect(canvas.width/10,0,canvas.width-2*canvas.width/10,canvas.height);
        for(let points of sinusCurve){
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(points[0],points[1],1,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }        
        let y = ctx.canvas.height*0.5 + 30*Math.sin(ballX/10);        
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(ballX,y,5,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
        ballX += 2;
        if(ballX<=canvas.width-canvas.width/12){
            requestAnimationFrame(shootBall);
        } else {
            ctx.clearRect(canvas.width*(9/10)-5,0,canvas.width/10+5,canvas.height);
            let image = new Image();
            image.onload = function(){
                ctx.drawImage(image,canvas.width-canvas.width/10,canvas.height/2-0.5*canvas.width/7,canvas.width/10,canvas.width/7);
            };
            image.src = imageSrcYellow;  
            timeoutId = setTimeout(resizeCanvas,3000);
        }
    };

    const drawBall= () => {

        let y = ctx.canvas.height*0.5 + 30*Math.sin(x/10);        
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(x,y,1,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
        sinusCurve.push([x,y]);
        x += 1;  

        if(x<=canvas.width-canvas.width/10){
            requestAnimationFrame(drawBall);
        } else {
            ballX = ctx.canvas.width/10+5;
            shootBall();
        }
        
    };    
    
    const resizeCanvas = () => {  
        sinusCurve = [];      
        clearTimeout(timeoutId);
        ctx.canvas.width=window.innerWidth*0.4;
        ctx.canvas.height=window.innerHeight/3; 
        x = ctx.canvas.width/10;       
        drawBall();
        drawPicture();
    }; 

    window.addEventListener("resize", resizeCanvas, false); 
    resizeCanvas();
}

