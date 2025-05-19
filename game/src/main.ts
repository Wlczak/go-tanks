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

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
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
        console.log("update");
    }

    private render() {
        console.log("render");
    }
}
