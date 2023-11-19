import { PlayerStates, states } from "./player_states.js"
import { CollisionAnimation } from "./collision_animation.js"

export class Player {
    constructor(game) {
        this.game = game
        this.width = 100
        this.height = 91.3
        this.x = 0
        this.y = this.game.height - this.height - this.game.groundMargin
        this.image = document.getElementById("player")
        this.frameX = 0
        this.frameY = 0
        this.fps = 30
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.speed = 0
        this.maxSpeed = 10
        this.vy = 0
        this.weight = 1
        const ps = new PlayerStates(this)
        this.states = ps.states()
        this.currentState = this.states[states.SITTING]
        this.currentState.enter()
        this.particles = []
        this.maxParticles = 200
    }
    update(inputKeys, deltaTime) {
        this.checkCollision()
        this.currentState.handlerInput(inputKeys)

        // horizontal movement
        if (inputKeys.includes("ArrowRight") && this.currentState !== this.states[states.HIT]) { this.speed = this.maxSpeed }
        else if (inputKeys.includes("ArrowLeft") && this.currentState !== this.states[states.HIT]) { this.speed = - this.maxSpeed }
        else { this.speed = 0 }
        this.x += this.speed
        // horizontal boundaries
        if (this.x < 0) {
            this.x = 0
        }
        if (this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width
        }

        // vertival movement
        this.y += this.vy
        if (!this.isOnGround()) { this.vy += this.weight }
        else { this.vy = 0 }
        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin
        }

        // sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frameX < this.maxFrame) {
                this.frameX++
            } else {
                this.frameX = 0
            }
        } else {
            this.frameTimer += deltaTime
        }

        // handle particles
        this.particles.forEach((particle, index) => {
            particle.update()
            if (particle.markedForDeletion) {
                this.particles.splice(index, 1)
            }
        })

        // limit length to this.maxParticles
        if (this.particles.length > this.maxParticles) {
            this.particles.length = this.maxParticles
        }
    }
    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height)
        }
        context.drawImage(this.image,
            this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height)

        this.particles.forEach(particle => {
            particle.draw(context)
        })
    }
    isOnGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin
    }
    setState(stateIdx, gameSpeed) {
        this.currentState = this.states[stateIdx]
        this.currentState.enter()
        this.game.speed = this.game.maxSpeed * gameSpeed
    }
    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.markedForDeletion = true
                this.game.collisions.push(
                    new CollisionAnimation(
                        this.game,
                        enemy.x + enemy.width * 0.5,
                        enemy.y + enemy.height * 0.5,
                    )
                )
                if (
                    this.currentState === this.states[states.ROLLING] ||
                    this.currentState === this.states[states.DIVING]
                ) {
                    this.game.score++
                } else {
                    this.setState(states.HIT, 0)
                    this.game.lives --
                    if (this.game.lives <= 0) {
                        this.game.gameOver = true
                    }
                }
            }
        })
    }
}