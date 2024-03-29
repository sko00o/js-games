import { Player } from "./player.js"
import { InputHandler } from "./input.js"
import { Background } from "./background.js"
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemy.js"
import { UI } from "./ui.js"

window.addEventListener("load", function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas1")
    const ctx = canvas.getContext("2d")
    canvas.height = 500
    canvas.width = 900

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.groundMargin = 40
            this.speed = 0
            this.maxSpeed = 6
            this.background = new Background(this)
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.UI = new UI(this)
            this.enemies = []
            this.collisions = []
            this.floatingMessages = []
            this.enemyTimer = 0
            this.enemyInterval = 1000
            this.debug = false
            this.score = 0
            this.fontColor = "black"
            this.time = 0
            this.maxTime = 30000
            this.gameOver = false
            this.lives = 5
            this.winningScore = 40
        }
        update(deltaTime) {
            this.time += deltaTime
            if (this.time > this.maxTime) {
                this.gameOver = true
            }

            this.background.update()
            this.player.update(this.input.keys, deltaTime)

            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.enemyTimer = 0
                this.addEnemy()
            } {
                this.enemyTimer += deltaTime
            }
            this.enemies.forEach((enemy, index) => {
                enemy.update(deltaTime)
            })

            // handle messages
            this.floatingMessages.forEach((message, index) => {
                message.update()
            })

            // handle collisions
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime)
            })
            
            this.enemies = this.enemies.filter(e => !e.markedForDeletion)
            this.collisions = this.collisions.filter(c => !c.markedForDeletion)
            this.floatingMessages = this.floatingMessages.filter(m => !m.markedForDeletion)
        }
        draw(context) {
            this.background.draw(context)
            this.player.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })
            this.floatingMessages.forEach((message, index) => {
                message.draw(context)
            })
            this.collisions.forEach(collision => {
                collision.draw(context)
            })
            this.UI.draw(context)
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this))
            } else if (this.speed > 0) {
                this.enemies.push(new ClimbingEnemy(this))
            }
            this.enemies.push(new FlyingEnemy(this))
        }
    }

    const game = new Game(canvas.width, canvas.height)
    let lastTime = 0
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime
        lastTime = timestamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime)
        game.draw(ctx)
        if (!game.gameOver) {
            requestAnimationFrame(animate)
        }
    }
    animate(0)
})