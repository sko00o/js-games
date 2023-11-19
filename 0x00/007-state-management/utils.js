export function drawStatusText(ctx, input, player) {
    ctx.font = "30px Helvetica";
    ctx.fillText("Last input: " + input.lastKey, 10, 50);
    ctx.fillText("Active state: " + player.currentState.state, 10, 90);
}