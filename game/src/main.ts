import { Controlls } from "./controlls.js";
import { Player } from "./objects/player.js";
import { ObjectContext } from "./object_context.js";

document.addEventListener("DOMContentLoaded", startGame);

function startGame() {
    const canvasF = document.getElementById("foreground") as HTMLCanvasElement;
    const canvasB = document.getElementById("background") as HTMLCanvasElement;

    if (canvasF && canvasB) {
        const ctxF = canvasF.getContext("2d");
        const ctxB = canvasB.getContext("2d");
        if (ctxF === null || ctxB === null) {
            console.log("Failed to get canvas context");
        } else {
            var game = new Game(ctxF as CanvasRenderingContext2D, ctxB as CanvasRenderingContext2D);
        }
    } else {
        document.body.innerHTML = "Error: failed to get canvas for game";
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
    }
}

class Game {
    private ctxF: CanvasRenderingContext2D;
    private ctxB: CanvasRenderingContext2D;
    private buffer: CanvasRenderingContext2D;
    private lastUpdate = performance.now();
    private accumulator = 0;
    private readonly fps = 60;
    private readonly timestep = 1000 / this.fps;

    private Controlls: Controlls;
    private ObjectCTX: ObjectContext;

    constructor(ctxF: CanvasRenderingContext2D, ctxB: CanvasRenderingContext2D) {
        this.ctxF = ctxF;
        this.ctxB = ctxB;

        this.ObjectCTX = new ObjectContext(ctxF.canvas.width, ctxF.canvas.height);

        console.log(ctxF.canvas.width, ctxF.canvas.height);

        const buffer = document.createElement("canvas") as HTMLCanvasElement;
        buffer.width = 800;
        buffer.height = 600;
        this.buffer = buffer.getContext("2d") as CanvasRenderingContext2D;

        this.ObjectCTX.registerPlayer(100, 100, "1", "Player 1", true);
        this.ObjectCTX.registerPlayer(300, 300, "2", "Player 2", true);

        this.Controlls = new Controlls();

        requestAnimationFrame(this.loop.bind(this));
    }

    private loop(currentTime: number) {
        const delta = currentTime - this.lastUpdate;
        this.lastUpdate = currentTime;
        this.accumulator += delta;

        while (this.accumulator >= this.timestep) {
            this.update();
            this.accumulator -= this.timestep;
        }

        this.render();
        requestAnimationFrame(this.loop.bind(this));
    }

    private update() {
        // update players
        this.ObjectCTX.Players.forEach((player) => {
            player.update();
        });
    }

    private render() {
        // render foreground
        this.buffer.fillStyle = "#E4DFDA";
        this.buffer.fillRect(0, 0, 800, 600);

        // render players
        this.ObjectCTX.Players.forEach((player) => {
            player.render(this.buffer);
        });
        this.ctxF.reset();
        this.ctxF.drawImage(this.buffer.canvas, 0, 0);
    }
}
