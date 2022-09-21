window.addEventListener('load', function(){
    const mainCanvas = this.document.getElementById('mainCanvas');
    const ctx = mainCanvas.getContext('2d');
    mainCanvas.width = 1280;
    mainCanvas.height = 720;
    let enemies = [];

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
        this.horizontalSpeed = 6;
        this.jumpV = 0;
        this.gravity = 1;
    }
    draw(context){
        context.imageSmoothingEnabled = false;
        context.fillStyle = 'red';
        //context.fillRect(this.x, this.y, this.sWidth, this.sHeight);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y,
            this.sWidth, this.sHeight);
    }
    update(input){
        if(input.keys.indexOf('ArrowRight') > -1){
            this.speed = this.horizontalSpeed;
        }
        else if(input.keys.indexOf('ArrowLeft') > -1){
            this.speed = -this.horizontalSpeed;
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
            if(this.jumpV < 0){
                this.frameX = 0;
                this.frameY = 2;
            }
            else if(this.jumpV == 0){
                this.frameX = 1;
                this.frameY = 2;
            }
            else{
                this.frameX = 2;
                this.frameY = 2;
            }
        }
        else{
            this.jumpV = 0;
            this.frameX = 0;
            this.frameY = 0;
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
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById('backgroundImage');
        this.x = 0;
        this.y = 0;
        this.width = 144;
        this.height = 69;
        this.sWidth = gameWidth;
        this.sHeight = gameHeight;
        this.speed = 5;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.sWidth, this.sHeight);
        context.drawImage(this.image, this.x + this.sWidth, this.y, this.sWidth, this.sHeight);
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.sWidth){
            this.x = 0;
        }
    }
}

class Enemy{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 18;
        this.height = 18;
        this.sWidth = 144; //stretched width - what user can see
        this.sHeight = 144; //stretched height - what user can see
        this.image = document.getElementById('boarImage');
        this.x = this.gameWidth;
        this.y = this.gameHeight - this.sHeight;
        this.frameX = 0;
        this.frameY = 1;
        this.speed = 5;
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.sWidth, this.sHeight)
    }
    update(){
        this.x -= this.speed; 
    }
}

function enemyHandler(deltaTime){
    if(enemyTimer > enemyInterval + randomEnemyInterval){
        enemies.push(new Enemy(mainCanvas.width, mainCanvas.height));
        enemyTimer = 0;
    }
    else{
        enemyTimer += deltaTime;
    }

    enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update();
    })
}

function displayStatusText(){

}

const input = new InputHandler();
const player = new Player(mainCanvas.width, mainCanvas.height);
const background = new Background(mainCanvas.width, mainCanvas.height);

let lastTime = 0;
let enemyTimer = 0;
let enemyInterval = 1000; //spawn interval in mseconds
let randomEnemyInterval = Math.random() * 1000 + 500;

function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    background.draw(ctx);
    //background.update();
    player.draw(ctx);
    player.update(input);
    enemyHandler(deltaTime);
    requestAnimationFrame(animate);
}
animate(0);
});