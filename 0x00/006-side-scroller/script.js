window.addEventListener("load", function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    const fullscreenButton = document.getElementById("fullscreenButton");

    class InputHandler {
        constructor() {
            this.keys = [];
            this.touchY = "";
            this.touchTreshold = 30;
            window.addEventListener('keydown', e => {
                if ((e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight")
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                } else if (e.key === "Enter" && gameOver) {
                    restartGame();
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight") {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY;
            });
            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < - this.touchTreshold && this.keys.indexOf("swipe up") === -1) {
                    this.keys.push("swipe up");
                } else if (swipeDistance > this.touchTreshold && this.keys.indexOf("swipe down") === -1) {
                    this.keys.push("swipe down");
                    if (gameOver) {
                        restartGame();
                    }
                }
            });
            window.addEventListener('touchend', e => {
                this.keys.splice(this.keys.indexOf("swipe up"), 1);
                this.keys.splice(this.keys.indexOf("swipe down"), 1);
            })
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.spriteWidth = 0;
            this.spriteHeight = 0;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById("playerImage");
            this.frameX = 0;
            this.maxFrame = 8
            this.frameY = 1;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.vx = 0;
            this.vy = 0;
            this.weight = 1;
        }
        restart() {
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 8
        }
        draw(ctx) {
            ctx.drawImage(this.image,
                this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                this.x, this.y, this.width, this.height);

            // ctx.lineWidth = 5;
            // ctx.strokeStyle = "white";
            // ctx.beginPath();
            // ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2)
            // ctx.stroke();
        }
        update(input, deltaTime, enemies) {
            // collision detection
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width / 2 - 20) - (this.x + this.width / 2);
                const dy = (enemy.y + enemy.width / 2) - (this.y + this.width / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width / 3 + this.width / 3) {
                    gameOver = true;
                }
            })

            // sprite animation
            if (this.frameTimer > this.frameInterval) {
                this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            // controls
            if (input.keys.indexOf("ArrowRight") > -1) {
                this.vx = 5;
            } else if (input.keys.indexOf("ArrowLeft") > -1) {
                this.vx = -5;
            } else if ((
                input.keys.indexOf("ArrowUp") > -1 ||
                input.keys.indexOf("swipe up") > -1
            ) && this.onGround()) {
                this.vy = -32;
            } else {
                this.vx = 0;
            }

            // horizontal movement
            this.x += this.vx;
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x > this.gameWidth - this.width) {
                this.x = this.gameWidth - this.width;
            }
            // vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                this.maxFrame = 5;
                this.frameY = 1;
            } else {
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0;
            }
        }
        onGround() {
            return this.y >= this.gameHeight - this.height
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById("backgroundImage");
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }
        restart() {
            this.x = 0;
        }
        draw(ctx) {
            ctx.drawImage(this.image,
                this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image,
                this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.x = 0;
            }
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById("enemyImage");
            this.width = 160;
            this.height = 119;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(ctx) {
            ctx.drawImage(this.image,
                this.frameX * this.width, 0, this.width, this.height,
                this.x, this.y, this.width, this.height);

            // ctx.lineWidth = 5;
            // ctx.strokeStyle = "white";
            // ctx.beginPath();
            // ctx.arc(this.x + this.width / 2 - 20, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2)
            // ctx.stroke();
        }
        update(deltaTime) {
            // sprite animation
            if (this.frameTimer > this.frameInterval) {
                this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randonEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            randonEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(e => {
            e.draw(ctx);
            e.update(deltaTime);
        })
        enemies = enemies.filter(e => !e.markedForDeletion);
    }

    function displayStatusText(ctx) {
        ctx.textAlign = "left";
        ctx.font = "40px Helvetica";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score, 20, 50);
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 22, 52);
        if (gameOver) {
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("GAME OVER, press Enter or swipe down to restart!", canvas.width / 2, 200);
            ctx.fillStyle = "white";
            ctx.fillText("GAME OVER, press Enter or swipe down to restart!", canvas.width / 2 + 2, 200 + 2);
        }
    }

    function restartGame() {
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    function toggleFullScreen() {
        console.log(document.fullscreenElement);
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert(`Error, can't enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    fullscreenButton.addEventListener("click", toggleFullScreen);

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randonEnemyInterval = Math.random() * 1000 + 500;

    let lastTime = 0;
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if (!gameOver) {
            requestAnimationFrame(animate);
        }
    }
    animate(0);
});