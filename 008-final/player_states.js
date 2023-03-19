import { Dust, Fire, Splash } from "./particles.js"

export const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
}

export class PlayerStates {
    constructor(player) {
        this.player = player
    }
    states() {
        return [
            new Sitting(this.player),
            new Running(this.player),
            new Jumping(this.player),
            new Falling(this.player),
            new Rolling(this.player),
            new Diving(this.player),
            new Hit(this.player),
        ]
    }
}

class State {
    constructor(state) {
        this.state = state
    }
}

export class Sitting extends State {
    constructor(player) {
        super("SITTING")
        this.player = player
    }
    enter() {
        this.player.frameX = 0
        this.player.frameY = 5
        this.player.maxFrame = 4
    }
    handlerInput(inputKeys) {
        if (inputKeys.includes("ArrowLeft") || inputKeys.includes("ArrowRight")) {
            this.player.setState(states.RUNNING, 1)
        } else if (inputKeys.includes("Enter")) {
            this.player.setState(states.ROLLING, 2)
        }
    }
}

export class Running extends State {
    constructor(player) {
        super("RUNNING")
        this.player = player
    }
    enter() {
        this.player.frameX = 0
        this.player.frameY = 3
        this.player.maxFrame = 6
    }
    handlerInput(inputKeys) {
        // add new Dust to the beginning of particles array
        this.player.particles.unshift(
            new Dust(
                this.player.game.speed,
                this.player.x + this.player.width * 0.5,
                this.player.y + this.player.height,
            )
        )

        if (inputKeys.includes("ArrowDown")) {
            this.player.setState(states.SITTING, 0)
        } else if (inputKeys.includes("ArrowUp")) {
            this.player.setState(states.JUMPING, 1)
        } else if (inputKeys.includes("Enter")) {
            this.player.setState(states.ROLLING, 2)
        }
    }
}

export class Jumping extends State {
    constructor(player) {
        super("JUMPING")
        this.player = player
    }
    enter() {
        if (this.player.isOnGround()) { this.player.vy -= 20 }
        this.player.frameX = 0
        this.player.frameY = 1
        this.player.maxFrame = 6
    }
    handlerInput(inputKeys) {
        if (inputKeys.includes("ArrowDown")) {
            this.player.setState(states.SITTING, 0)
        }
        if (this.player.vy > this.player.weight) {
            this.player.setState(states.FALLING, 1)
        } else if (inputKeys.includes("Enter")) {
            this.player.setState(states.ROLLING, 2)
        } else if (inputKeys.includes("ArrowDown")) {
            this.player.setState(states.DIVING, 0)
        }
    }
}

export class Falling extends State {
    constructor(player) {
        super("FALLING")
        this.player = player
    }
    enter() {
        this.player.frameX = 0
        this.player.frameY = 2
        this.player.maxFrame = 6
    }
    handlerInput(inputKeys) {
        if (this.player.isOnGround()) {
            this.player.setState(states.RUNNING, 1)
        } else if (inputKeys.includes("ArrowDown")) {
            this.player.setState(states.DIVING, 0)
        }
    }
}

export class Rolling extends State {
    constructor(player) {
        super("ROLLING")
        this.player = player
    }
    enter() {
        this.player.frameX = 0
        this.player.frameY = 6
        this.player.maxFrame = 6
    }
    handlerInput(inputKeys) {
        this.player.particles.unshift(
            new Fire(
                this.player.game.speed,
                this.player.x + this.player.width * 0.5,
                this.player.y + this.player.height * 0.5,
            )
        )

        if (!inputKeys.includes("Enter")) {
            if (this.player.isOnGround()) {
                this.player.setState(states.RUNNING, 1)
            } else {
                this.player.setState(states.FALLING, 1)
            }
        } else if (
            inputKeys.includes("Enter") &&
            inputKeys.includes("ArrowUp") &&
            this.player.isOnGround()
        ) {
            this.player.vy = -27
        } else if (inputKeys.includes("ArrowDown")) {
            this.player.setState(states.DIVING, 0)
        }
    }
}

export class Diving extends State {
    constructor(player) {
        super("ROLLING")
        this.player = player
    }
    enter() {
        this.player.frameX = 0
        this.player.frameY = 6
        this.player.maxFrame = 6
        this.player.vy = 15
    }
    handlerInput(inputKeys) {
        this.player.particles.unshift(
            new Fire(
                this.player.game.speed,
                this.player.x + this.player.width * 0.5,
                this.player.y + this.player.height * 0.5,
            )
        )

        if (this.player.isOnGround()) {
            if (inputKeys.includes("Enter")) {
                this.player.setState(states.ROLLING, 2)
            } else {
                this.player.setState(states.RUNNING, 1)
                for (let i = 0; i < 30; i++) {
                    this.player.particles.unshift(
                        new Splash(
                            this.player.game.speed,
                            this.player.x + this.player.width * 0.5,
                            this.player.y + this.player.height,
                        )
                    )
                }
            }
        }
    }
}

export class Hit extends State {
    constructor(player) {
        super("HIT")
        this.player = player
    }
    enter() {
        this.player.frameX = 0
        this.player.frameY = 4
        this.player.maxFrame = 10
    }
    handlerInput(inputKeys) {
        if (this.player.frameX >= 10) {
            if (this.player.isOnGround()) {
                this.player.setState(states.RUNNING, 1)
            } else {
                this.player.setState(states.FALLING, 1)
            }
        }
    }
}