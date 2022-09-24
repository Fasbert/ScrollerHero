window.addEventListener('load', function(){
    const mainCanvas = this.document.getElementById("mainCanvas");
    const ctx = mainCanvas.getContext("2d");
    mainCanvas.width = 1280;
    mainCanvas.height = 720;    
    let score = 0;
    let enemies = [];
    let gameOver = false;

    //Sounds
    const jumpSound = new Audio('../sounds/8bit-jump.mp3');
    const goSound = new Audio('../sounds/goSound.wav');
    const bgMusic = this.document.getElementById('bgMusic');
    bgMusic.volume = 0.5;
    
class InputHandler{
    constructor(){
        this.keys = [];
        window.addEventListener('keydown', e => {
            if((e.key === 'ArrowDown' ||
                e.key === ' ' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight')
                && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', e => {
            if(e.key === 'ArrowDown' ||
                e.key === ' ' ||
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
        this.y = this.gameHeight - this.sHeight;
        this.image = document.getElementById('playerImage');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 9; //Sprites in animation counted from 0  
        this.fps = 18;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;
        this.horizontalSpeed = 9;
        this.speed = 0;
        this.jumpV = 0;
        this.gravity = 1;
    }
    draw(context){
        context.imageSmoothingEnabled = false;
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, 
            this.x, this.y, this.sWidth, this.sHeight);
        //Debug
        // context.strokeStyle = "green";
        // context.beginPath();
        // context.arc(this.x + this.sWidth/2, this.y + this.sHeight/2, this.sWidth/2, 0 , Math.PI * 2);
        // context.stroke();
        
    }
    update(input, deltaTime, enemies){
        //Collision detection 
        enemies.forEach(enemy => {
            const dx = (enemy.x + enemy.sWidth/2) - (this.x + this.sWidth/2);
            const dy = (enemy.y + enemy.sHeight) - (this.y + this.sHeight/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if(distance < enemy.sWidth/2 + this.sWidth/2){
                gameOver = true;
                bgMusic.pause();
                goSound.play();
            }
        });
        //Animation
        if(this.frameTimer > this.frameInterval){
            if(this.frameX >= this.maxFrame){
                this.frameX = 0;
            }
            else{
                this.frameX++;
            }
            this.frameTimer = 0;
        }
        else{
            this.frameTimer += deltaTime;
        }

        //Controls
        if(input.keys.indexOf('ArrowRight') > -1){
            this.speed = this.horizontalSpeed;
        }
        else if(input.keys.indexOf('ArrowLeft') > -1){
            this.speed = -this.horizontalSpeed;
        }
        else if(input.keys.indexOf('ArrowUp')  > -1 && this.onGround()){
            this.jumpV -= 21;
            jumpSound.play();
        }
        else if(input.keys.indexOf(' ')  > -1 && this.onGround()){
            this.jumpV -= 21;
            jumpSound.play();
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
            this.maxFrame = 2;
            this.frameY = 1;
            //Fine jump animation
            if(this.jumpV < 0){
                this.frameX = 0;
            }
            else if(this.jumpV == 0){
                this.frameX = 1;
            }
            else{
                this.frameX = 2;
            }
        }
        else{
            this.jumpV = 0;
            this.maxFrame = 9;
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
        this.speed = 3;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.sWidth, this.sHeight);
        context.drawImage(this.image, this.x + this.sWidth, this.y, this.sWidth, this.sHeight);
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.sWidth){
            this.x = 0;
            this.speed += 0.1;
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
        this.maxFrame = 3; //sprites count - 1
        this.fps = 15;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;
        this.speed = 8;
        this.markedForDeletion = false;
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, 
            this.x, this.y, this.sWidth, this.sHeight);
        //Debug gizmo
        // context.strokeStyle = "red";
        // context.strokeRect(this.x, this.y + this.sHeight / 3, this.sWidth, this.sHeight);
        
    }
    update(deltaTime){
        if(this.frameTimer > this.frameInterval){
            if(this.frameX >= this.maxFrame){
                this.frameX = 0;
            }
            else{
                this.frameX++;
            }

            this.frameTimer = 0;
        }
        else{
            this.frameTimer += deltaTime;
        }

        this.x -= this.speed; 
        if(this.x < 0  - this.sWidth){
            
            this.markedForDeletion = true;
            score++;
        }
        console.log(this.speed);
    }
}

function enemyHandler(deltaTime){
    if(enemyTimer > enemyInterval + randomEnemyInterval){
        enemies.push(new Enemy(mainCanvas.width, mainCanvas.height));
        console.log(enemies);
        enemyTimer = 0;
    }
    else{
        enemyTimer += deltaTime;
    }

    enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update(deltaTime);
    });
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
}

function displayStatusText(context){
    context.font = "40px Helvetica";
    context.fillStyle = "#562B08";
    context.fillText("Score: " + score, 40, 50);
    context.fillStyle = "#FD841F";
    context.fillText("Score: " + score, 38, 52);

    if(gameOver){
        context.textAlign = "center";
        context.fillStyle = "#FD841F";
        context.fillText("GAME OVER!", mainCanvas.width/2, mainCanvas.height/2);
    }
}

const input = new InputHandler();
const player = new Player(mainCanvas.width, mainCanvas.height);
const background = new Background(mainCanvas.width, mainCanvas.height);

let lastTime = 0;
let enemyTimer = 0;
let enemyInterval = 1000; //spawn interval in mseconds
let randomEnemyInterval = Math.random() * (1500 - 200) + 200;

function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    background.draw(ctx);
    background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    enemyHandler(deltaTime);
    displayStatusText(ctx);

    if(!gameOver){
        requestAnimationFrame(animate);
    }
}
animate(0);

});




