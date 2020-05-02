(function(){

    const canvas = document.getElementById("welcomeCanvas");

    if(!canvas){
        return;
    }

    const ctx = canvas.getContext("2d");

    const pointQuantity = 500;
    let allPointsArray = [];

    class Points {
        constructor(X,Y,r,color){
            this.x = X;
            this.y = Y;
            this.radius = r;
            this.color = color;
        }

        drawPoint(){
            const random = Math.round(Math.random());
            const value = random === 1 ? true : false;
            ctx.beginPath();
            if(value){
                const red = Math.round(Math.random()*255);
                const green = Math.round(Math.random()*255);
                const blue = Math.round(Math.random()*255);
                this.color = `rgb(${red},${green},${blue})`;
            }
            const radius = Math.floor(Math.random()*6);
            this.radius = radius;
            ctx.fillStyle = this.color;
            ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        positionPoint(){
            this.x = Math.floor(Math.random()*(canvas.width-(100)))+50;
            this.y = Math.floor(Math.random()*(canvas.height-(100)))+50;
        }   
        
        drawAgainPoint(){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }

    class Mouse extends Points {
        constructor(X,Y,r,color){
            super(X,Y,r,color);
        }

        drawMouse(){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        drawCanvas(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            for( let point of allPointsArray){
                point.drawAgainPoint();
            }
        }

        connect(){    
            for ( let i = 0; i<pointQuantity; i++){
                const distance_2 = Math.pow(this.x-allPointsArray[i].x,2)+Math.pow(this.y-allPointsArray[i].y,2);
                const distance = Math.sqrt(distance_2);
                if(distance < 70){
                    ctx.beginPath;
                    ctx.strokeStyle = allPointsArray[i].color;
                    ctx.lineWidth = 3;
                    ctx.lineCap = "round";
                    ctx.moveTo(allPointsArray[i].x, allPointsArray[i].y);
                    ctx.lineTo(allPointsArray[i].x - (allPointsArray[i].x - this.x )*0.4,allPointsArray[i].y - (allPointsArray[i].y - this.y)*0.4);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }

    const createWindow = () => {
        for(let i=0; i<=pointQuantity; i++){
            const point = new Points(0,0,5,"white");
            point.positionPoint();
            point.drawPoint();
            allPointsArray.push(point);
        }        
    };

    const resizeCanvas = () => {
        allPointsArray = [];
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        createWindow();
    };    

    window.addEventListener("resize", resizeCanvas, false);  

    canvas.addEventListener("mousemove", e => {         
        let mouseX = e.clientX;
        let mouseY = e.clientY; 
        const stars = new Mouse(0,0,0,"white");
        stars.positionPoint();
        stars.drawPoint();
        allPointsArray.push(stars);
        const mousePointer = new Mouse(mouseX,mouseY,15,"white");
        mousePointer.drawCanvas();        
        mousePointer.connect();
        mousePointer.drawMouse();
    });
    
    resizeCanvas();

})();