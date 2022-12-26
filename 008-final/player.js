import { PlayerStates } from "./player_states.js"

export class Player {
    constructor(game) {
        this.game = game
        this.width = 100
        this.height = 91.3
        this.x = 0
        this.y = this.game.height - this.height
        this.image = document.getElementById("player")
        this.frameX = 0
        this.frameY = 0
        this.speed = 0
        this.maxSpeed = 10
        this.vy = 0
        this.weight = 1
        const ps = new PlayerStates(this)
        this.states = ps.states()
        this.currentState = this.states[0]
        this.currentState.enter()
    }
    update(inputKeys) {
        this.currentState.handlerInput(inputKeys)

        // horizontal movement
        if (inputKeys.includes("ArrowRight")) { this.speed = this.maxSpeed }
        else if (inputKeys.includes("ArrowLeft")) { this.speed = - this.maxSpeed }
        else { this.speed = 0 }
        this.x += this.speed

        if (this.x < 0) {
            this.x = 0
        }
        if (this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width
        }

        // vertival movement
        // if (this.isOnGround() && inputKeys.includes("ArrowUp")) { this.vy = -20 }
        this.y += this.vy
        if (!this.isOnGround()) { this.vy += this.weight }
        else { this.vy = 0 }
    }
    draw(context) {
        context.drawImage(this.image,
            this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height)
    }
    isOnGround() {
        return this.y >= this.game.height - this.height
    }
    setState(stateIdx) {
        this.currentState = this.states[stateIdx]
        this.currentState.enter()
    }
}