window.addEventListener('load', function(){
    const mainCanvas = this.document.getElementById('mainCanvas');
    const ctx = mainCanvas.getContext('2d');
    mainCanvas.width = 1280;
    mainCanvas.height = 720;

class InputHandler{
    constructor(){
        this.keys = [];
        window.addEventListener('keydown', e => {
            if((e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight')
                && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', e => {
            if(e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight'){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}

class Player{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 18;
        this.height = 18;
        this.sWidth = 144; //stretched width - what user can see
        this.sHeight = 144; //stretched height - what user can see
        this.x = 100;
        this.y = this.gameHeight - this.sWidth;
        this.image = document.getElementById('playerImage');
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 0;
        this.jumpV = 0;
        this.gravity = 1;
    }
    draw(context){
        context.imageSmoothingEnabled = false;
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.sWidth, this.sHeight);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y,
            this.sWidth, this.sHeight);
    }
    update(input){
        if(input.keys.indexOf('ArrowRight') > -1){
            this.speed = 5;
        }
        else if(input.keys.indexOf('ArrowLeft') > -1){
            this.speed = -5;
        }
        else if(input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
            this.jumpV -= 20;
        }
        else{
            this.speed = 0;
        }
        //Horizontal Movement
        this.x += this.speed;

        if(this.x < 0){
            this.x = 0;
        }
        else if(this.x > this.gameWidth - this.sWidth){
            this.x = this.gameWidth - this.sWidth;
        }
        //Vertical movement
        this.y += this.jumpV;

        if(!this.onGround()){
            this.jumpV += this.gravity;
        }
        else{
            this.jumpV = 0;
        }

        if(this.y >= this.gameHeight - this.sHeight){
            this.y = this.gameHeight - this.sHeight;
        }
    }
    onGround(){
        return this.y >= this.gameHeight - this.sHeight;
    }
}

class Background{

}

class Enemy{

}

function enemyHandler(){

}

function displayStatusText(){

}

const input = new InputHandler();
const player = new Player(mainCanvas.width, mainCanvas.height);



function animate(){
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    player.draw(ctx);
    player.update(input);
    requestAnimationFrame(animate);
}
animate();


});