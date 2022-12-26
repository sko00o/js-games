import { Player } from "./player.js"
import { InputHandler } from "./input.js"

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
            this.player = new Player(this)
            this.input = new InputHandler()
        }
        update() {
            this.player.update(this.input.keys)
        }
        draw(context) {
            this.player.draw(context)
        }
    }

    const game = new Game(canvas.width, canvas.height)
    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.draw(ctx)
        game.update()
        requestAnimationFrame(animate)
    }
    animate(0)
})