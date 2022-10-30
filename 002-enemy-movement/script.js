/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 20;
const enemiesArray = [];
let gameFrame = 0;

class Enemy1 {
    constructor() {
        this.image = new Image();
        this.image.src = 'assets/enemy1.png';
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.spriteFrame = 6
        // this.speed = Math.random() * 4 - 2;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    }
    update() {
        this.x += Math.random() * 5 - 2.5;
        this.y += Math.random() * 5 - 2.5;

        // animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            // this.frame >= this.spriteFrame ? this.frame = 0 : this.frame++;
            this.frame = (this.frame + 1) % this.spriteFrame;
        }
    }
    draw() {
        ctx.drawImage(this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
}

class Enemy2 {
    constructor() {
        this.image = new Image();
        this.image.src = 'assets/enemy2.png';
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.spriteFrame = 6
        this.speed = Math.random() * 4 + 1;

        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 10;
    }
    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }

        this.y += this.curve * Math.sin(this.angle);
        this.angle += this.angleSpeed;

        // animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            // this.frame >= this.spriteFrame ? this.frame = 0 : this.frame++;
            this.frame = (this.frame + 1) % this.spriteFrame;
        }
    }
    draw() {
        ctx.drawImage(this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
}

class Enemy3 {
    constructor() {
        this.image = new Image();
        this.image.src = 'assets/enemy3.png';
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.spriteFrame = 6
        this.speed = Math.random() * 4 + 1;

        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        this.angle = Math.random() * 500;
        this.angleSpeed = Math.random() * 5.5 + 0.5;
    }
    update() {
        this.x = canvas.width / 2 * Math.cos(this.angle * Math.PI / 200) + canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 * Math.sin(this.angle * Math.PI / 300) + canvas.height / 2 - this.height / 2;

        this.angle += this.angleSpeed;
        if (this.x + this.width < 0) {
            this.x = canvas.width
        }

        // animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame = (this.frame + 1) % this.spriteFrame;
        }
    }
    draw() {
        ctx.drawImage(this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
}

class Enemy4 {
    constructor() {
        this.image = new Image();
        this.image.src = 'assets/enemy4.png';
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.spriteFrame = 9
        this.speed = Math.random() * 4 + 1;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * (canvas.width - this.width);
        this.newY = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.interval = Math.floor(Math.random() * 200 + 50);
    }
    update() {
        if (gameFrame % this.interval === 0) {
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx / 70;
        this.y -= dy / 70;

        if (this.x + this.width < 0) {
            this.x = canvas.width
        }

        // animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame = (this.frame + 1) % this.spriteFrame;
        }
    }
    draw() {
        ctx.drawImage(this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
}

for (let i = 0; i < numberOfEnemies; i++) {
    enemiesArray.push(new Enemy4());
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_HEIGHT, CANVAS_HEIGHT);
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    })
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();
