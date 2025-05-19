import { Controlls } from "./controlls.js";
import { Player } from "./objects/player.js";

document.addEventListener("DOMContentLoaded", startGame);

function startGame() {
    const canvas = document.getElementById("test") as HTMLCanvasElement;

    if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.log("Failed to get canvas context");
        } else {
            var game = new Game(ctx);
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
    private ctx: CanvasRenderingContext2D;
    private lastUpdate = performance.now();
    private accumulator = 0;
    private readonly timestep = 1000 / 60;

    private Player: Player;
    private Controlls: Controlls;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.Player = new Player("1", "Player 1", "red", 200, 200, 0);
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
        var speed = 15;
        if (this.Controlls.up) {
            this.Player.y -= Math.cos((this.Player.rotation / 180) * Math.PI) * speed;
            this.Player.x += Math.sin((this.Player.rotation / 180) * Math.PI) * speed;
        }
        if (this.Controlls.down) {
            this.Player.y += Math.cos((this.Player.rotation / 180) * Math.PI) * speed;
            this.Player.x -= Math.sin((this.Player.rotation / 180) * Math.PI) * speed;
        }
        if (this.Controlls.left) {
            this.Player.rotation -= speed / 2;
        }
        if (this.Controlls.right) {
            this.Player.rotation += speed / 2;
        }
    }

    private render() {
        this.ctx.reset();

        this.ctx.fillStyle = this.Player.color;
        var relX = this.Player.x + this.Player.width / 2;
        var relY = this.Player.y + this.Player.height / 2;

        this.ctx.translate(relX, relY);
        this.ctx.rotate((this.Player.rotation * Math.PI) / 180);
        this.ctx.translate(-relX, -relY);

        this.ctx.fillRect(this.Player.x, this.Player.y, this.Player.width, this.Player.height);
    }
}
