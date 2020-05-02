(function(){

    const canvas = document.getElementById("welcomeCanvas");

    if(!canvas){
        return;
    }

    const ctx = canvas.getContext("2d");

    const pointQuantity = 500;
    const allPointsArray = [];

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
                var red = Math.round(Math.random()*255);
                var green = Math.round(Math.random()*255);
                var blue = Math.round(Math.random()*255);
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

        eraseOldMouse(x,y){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(x,y,this.radius,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        drawCanvas(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            for( let point of allPointsArray){
                point.drawAgainPoint();
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
        const mousePointer = new Mouse(mouseX,mouseY,20,"white");
        mousePointer.drawCanvas();
        mousePointer.drawMouse();
    });
    
    resizeCanvas();

})();