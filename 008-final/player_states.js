const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
}

export class PlayerStates {
    constructor(player) {
        this.player = player
    }
    states() {
        return [
            new Sitting(this.player),
            new Running(this.player),
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
        this.player.frameY = 5
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
        this.player.frameY = 3
    }
    handlerInput(inputKeys) {
        if (inputKeys.includes("ArrowDown")) {
            this.player.setState(states.SITTING)
        }
    }
}

export class Jumping extends State {
    constructor(player) {
        super("JUMPING")
        this.player = player
    }
    enter() {
        if (this.player.isOnGround()) {this.player.vy -= 20}
        this.player.frameY = 1
    }
    handlerInput(inputKeys) {
        if (inputKeys.includes("ArrowDown")) {
            this.player.setState(states.SITTING)
        }
    }
}