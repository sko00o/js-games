import { Player } from "./player.js"
import { InputHandler } from "./input.js"
import { Background } from "./background.js"
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemy.js"

window.addEventListener("load", function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas1")
    const ctx = canvas.getContext("2d")
    canvas.height = 500
    canvas.width = 500

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.groundMargin = 80
            this.speed = 0
            this.maxSpeed = 6
            this.background = new Background(this)
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.enemies = []
            this.enemyTimer = 0
            this.enemyInterval = 1000
            this.debug = false
        }
        update(deltaTime) {
            this.background.update()
            this.player.update(this.input.keys, deltaTime)

            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.enemyTimer = 0
                this.addEnemy()
            } {
                this.enemyTimer += deltaTime
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime)
                if (enemy.markedForDeletion) {
                    this.enemies.splice(this.enemies.indexOf(enemy), 1)
                }
            })

        }
        draw(context) {
            this.background.draw(context)
            this.player.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this))
            } else if (this.speed > 0) {
                this.enemies.push(new ClimbingEnemy(this))
            }
            this.enemies.push(new FlyingEnemy(this))
            console.log(this.enemies)
        }
    }

    const game = new Game(canvas.width, canvas.height)
    let lastTime = 0
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime
        lastTime = timestamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.draw(ctx)
        game.update(deltaTime)
        requestAnimationFrame(animate)
    }
    animate(0)
})