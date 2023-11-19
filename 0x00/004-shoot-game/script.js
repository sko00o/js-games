/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
ctx.font = "50px Impact";

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];
class Raven {
    constructor() {
        this.image = new Image();
        this.image.src = "assets/raven.png";
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markForDeletion = false;

        this.frame = 0;
        this.maxFrame = 5;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;

        this.randomColor = [
            // floor to int number
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
        ]
        this.color = "rgb(" + this.randomColor.join(",") + ")";
        this.hasTrail = Math.random() > 0.5;
    }
    update(deltaTime) {
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY *= -1;
        }

        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) {
            this.markForDeletion = true;
        }

        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            this.frame < this.maxFrame ? this.frame++ : this.frame = 0;
            this.timeSinceFlap = 0;
            if (this.hasTrail) {
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particles(this.x, this.y, this.width, this.color));
                }
            }
        }
        if (this.x < 0 - this.width) {
            gameOver = true;
        }
    }
    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image,
            this.spriteWidth * this.frame, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height,
        )
    }
}

let explotions = [];
class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = 'assets/boom.png';
        this.sound = new Audio();
        this.sound.src = 'assets/boom.wav';
        this.sound.volume = 0.15;
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.x = x;
        this.y = y;
        this.size = size;
        this.frame = 0;
        this.maxFrame = 5;
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markForDeletion = false;
    }
    update(deltaTime) {
        if (this.frame === 0) {
            this.sound.play();
        }
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.timeSinceLastFrame = 0;
            this.frame < this.maxFrame ? this.frame++ : this.markForDeletion = true;
        };
    }
    draw() {
        ctx.drawImage(this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y - this.size / 4,
            this.size, this.size,
        );
    }
}

let particles = [];
class Particles {
    constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size / 2 + Math.random() * 50 - 25;
        this.y = y + this.size / 3 + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size / 10;
        this.maxRadius = Math.random() * 20 + 50;
        this.speedX = Math.random() * 1 + 0.5;
        this.markForDeletion = false;
        this.color = color;
    }
    update() {
        this.x += this.speedX;
        this.radius += 0.8;
        if (this.radius > this.maxRadius - 5) {
            this.markForDeletion = true;
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 50, 75);
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 55, 80);
}

function drawGameOver() {
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER, your score is " + score,
        canvas.width / 2,
        canvas.height / 2,
    )
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER, your score is " + score,
        canvas.width / 2 + 5,
        canvas.height / 2 + 5,
    )
}

window.addEventListener("click", function (e) {
    const detectPixcelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixcelColor.data;
    // console.log(pc);
    ravens.forEach(o => {
        if (o.randomColor[0] === pc[0] &&
            o.randomColor[1] === pc[1] &&
            o.randomColor[2] === pc[2]) {
            // collision detected
            o.markForDeletion = true;
            score++;
            explotions.push(new Explosion(o.x, o.y, o.width));
        }
    });
})

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort((a, b) => {
            // draw smaller one first
            return a.width - b.width
        })
    }
    drawScore();
    [...particles, ...ravens, ...explotions].forEach(raven => {
        raven.update(deltaTime);
        raven.draw();
    })
    ravens = ravens.filter(o => !o.markForDeletion);
    explotions = explotions.filter(o => !o.markForDeletion);
    particles = particles.filter(o => !o.markForDeletion);
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0);