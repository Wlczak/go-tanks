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
    private buffer: CanvasRenderingContext2D;
    private lastUpdate = performance.now();
    private accumulator = 0;
    private readonly timestep = 1000 / 60;

    private Player: Player;
    private Controlls: Controlls;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        const buffer = document.createElement("canvas") as HTMLCanvasElement;
        buffer.width = 800;
        buffer.height = 600;
        this.buffer = buffer.getContext("2d") as CanvasRenderingContext2D;
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
        var speed = 8;
        if (this.Controlls.up) {
            this.Player.y -= Math.cos((this.Player.rotation / 180) * Math.PI) * speed;
            this.Player.x += Math.sin((this.Player.rotation / 180) * Math.PI) * speed;
        }
        if (this.Controlls.down) {
            this.Player.y += Math.cos((this.Player.rotation / 180) * Math.PI) * speed;
            this.Player.x -= Math.sin((this.Player.rotation / 180) * Math.PI) * speed;
        }
        if (this.Controlls.left) {
            this.Player.rotation -= speed;
        }
        if (this.Controlls.right) {
            this.Player.rotation += speed;
        }
    }

    private render() {
        var img = new Image();
        img.src = "player.png";

        var relX = this.Player.x + img.width / 2;
        var relY = this.Player.y + img.height / 2;

        this.buffer.reset();

        this.buffer.fillStyle = "#E4DFDA";

        this.buffer.fillRect(0, 0, 800, 600);
        this.buffer.translate(relX, relY);
        this.buffer.rotate((this.Player.rotation * Math.PI) / 180);
        this.buffer.translate(-relX, -relY);

        this.buffer.drawImage(img, this.Player.x, this.Player.y);
        // this.buffer.fillRect(this.Player.x, this.Player.y, this.Player.width, this.Player.height);

        this.ctx.reset();
        this.ctx.drawImage(this.buffer.canvas, 0, 0);
    }
}
