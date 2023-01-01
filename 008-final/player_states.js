const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
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
            this.player.setState(states.RUNNING)
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
        if (inputKeys.includes("ArrowDown")) {
            this.player.setState(states.SITTING)
        } else if (inputKeys.includes("ArrowUp")) {
            this.player.setState(states.JUMPING)
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
            this.player.setState(states.SITTING)
        }
        if (this.player.vy > this.player.weight) {
            this.player.setState(states.FALLING)
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
            this.player.setState(states.RUNNING)
        }
    }
}