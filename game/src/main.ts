import { Controlls } from "./controlls.js";
import { Player } from "./objects/player.js";
import { ObjectContext } from "./object_context.js";
import { WallCell } from "./objects/wall_cell.js";
import { Wall } from "./objects/wall.js";

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

        this.ObjectCTX.registerPlayer(550, 550, "1", "Player 1", true);
        this.ObjectCTX.registerPlayer(300, 300, "2", "Player 2", false);

        // this.ObjectCTX.registerWall(50, 50, 400, 50);
        // this.ObjectCTX.registerWall(50, 120, 400, 120);

        this.Controlls = new Controlls();

        this.generateWalls();
        this.renderBackground();

        requestAnimationFrame(this.loop.bind(this));
    }

    private generateWalls() {
        const blockWidth = 100;
        const blockHeight = 100;
        const propability = 50 / 100;

        const WallCells: WallCell[][] = [];
        var cellCounter = 0;

        const maxXIndex = this.ctxF.canvas.width / blockWidth - 1;
        const maxYIndex = this.ctxF.canvas.height / blockHeight - 1;

        console.log("width", maxXIndex);
        console.log("height", maxYIndex);

        for (var i = 0; i <= maxXIndex; i++) {
            WallCells[i] = [];
            for (var j = 0; j <= maxYIndex; j++) {
                WallCells[i][j] = new WallCell(i * 100, j * 100);
            }
        }

        console.log(WallCells);

        var prevCoords: { x: number; y: number }[] = [];
        var coords = { x: 0, y: 0 };
        var safetyCounter = 0;

        while (cellCounter < WallCells.length * WallCells[0].length) {
            coords = generateCell(coords.x, coords.y);
            if (coords.x !== -1) {
                prevCoords.push(coords);
            }
            if (coords.x === -1 && prevCoords.length > 0) {
                coords = prevCoords.pop() as { x: number; y: number };
            } else if (coords.x === -1 && prevCoords.length == 0) {
                console.log("stopped");
                break;
            }
            safetyCounter++;
            if (safetyCounter > 1000) {
                break;
            }
        }
        //register all walls from wallcells
        WallCells.forEach((element) => {
            element.forEach((e) => {
                if (e.hasBeenVisited) {
                    if (e.hasTopWall) {
                        this.ObjectCTX.registerWall(e.x, e.y, e.x + blockWidth, e.y);
                    }
                    if (e.hasRightWall) {
                        this.ObjectCTX.registerWall(
                            e.x + blockWidth,
                            e.y,
                            e.x + blockWidth,
                            e.y + blockHeight
                        );
                    }
                    if (e.hasBottomWall) {
                        this.ObjectCTX.registerWall(
                            e.x,
                            e.y + blockHeight,
                            e.x + blockWidth,
                            e.y + blockHeight
                        );
                    }
                    if (e.hasLeftWall) {
                        this.ObjectCTX.registerWall(e.x, e.y, e.x, e.y + blockHeight);
                    }
                }
            });
        });

        function generateCell(xIndex: number, yIndex: number): { x: number; y: number } {
            var rand = Math.random();
            // runs two times to always select something
            if (WallCells[xIndex][yIndex].hasBeenVisited) {
                var exit = true;
                // right
                if (xIndex < maxXIndex) {
                    if (WallCells[xIndex + 1][yIndex].hasBeenVisited === false) {
                        exit = false;
                    }
                }
                // bottom
                if (yIndex < maxYIndex) {
                    if (WallCells[xIndex][yIndex + 1].hasBeenVisited === false) {
                        exit = false;
                    }
                }
                // top
                if (yIndex > 0) {
                    if (WallCells[xIndex][yIndex - 1].hasBeenVisited === false) {
                        exit = false;
                    }
                }
                // left
                if (xIndex > 0) {
                    if (WallCells[xIndex - 1][yIndex].hasBeenVisited === false) {
                        exit = false;
                    }
                }

                if (exit) {
                    console.log("exit", xIndex, yIndex);
                    return { x: -1, y: -1 };
                }
            }
            for (var i = 0; i < 2; i++) {
                console.log("run");
                WallCells[xIndex][yIndex].hasBeenVisited = true;
                // top
                if (rand <= 0.25) {
                    if (yIndex > 0) {
                        if (WallCells[xIndex][yIndex - 1].hasBeenVisited === false) {
                            console.log(WallCells[xIndex][yIndex]);
                            console.log(WallCells[xIndex][yIndex - 1]);

                            cellCounter++;
                            WallCells[xIndex][yIndex - 1].hasBottomWall = false;
                            WallCells[xIndex][yIndex].hasTopWall = false;
                            return { x: xIndex, y: yIndex - 1 };
                        }
                    }
                }
                // left
                if (rand <= 0.5) {
                    if (xIndex > 0) {
                        if (WallCells[xIndex - 1][yIndex].hasBeenVisited === false) {
                            console.log(WallCells[xIndex][yIndex]);
                            console.log(WallCells[xIndex - 1][yIndex]);

                            cellCounter++;
                            WallCells[xIndex - 1][yIndex].hasRightWall = false;
                            WallCells[xIndex][yIndex].hasLeftWall = false;
                            return { x: xIndex - 1, y: yIndex };
                        }
                    }
                }
                // bottom
                if (rand <= 0.75) {
                    if (yIndex < maxYIndex) {
                        if (WallCells[xIndex][yIndex + 1].hasBeenVisited === false) {
                            console.log(WallCells[xIndex][yIndex]);
                            console.log(WallCells[xIndex][yIndex + 1]);

                            cellCounter++;
                            WallCells[xIndex][yIndex + 1].hasTopWall = false;
                            WallCells[xIndex][yIndex].hasBottomWall = false;
                            return { x: xIndex, y: yIndex + 1 };
                        }
                    }
                }
                // right
                if (rand <= 1) {
                    if (xIndex < maxXIndex) {
                        if (WallCells[xIndex + 1][yIndex].hasBeenVisited === false) {
                            console.log(WallCells[xIndex][yIndex]);
                            console.log(WallCells[xIndex + 1][yIndex]);

                            cellCounter++;
                            WallCells[xIndex + 1][yIndex].hasLeftWall = false;
                            WallCells[xIndex][yIndex].hasRightWall = false;
                            return { x: xIndex + 1, y: yIndex };
                        }
                    }
                }
                rand = 0;
            }
            return { x: -1, y: -1 };
        }

        // for (let x = 0; x < this.ObjectCTX.borderX; x += blockWidth) {
        //     for (let y = 0; y < this.ObjectCTX.borderY; y += blockHeight) {
        //         if (Math.random() < propability) {
        //             this.ObjectCTX.registerWall(x, y, x + blockWidth, y);
        //         }
        //         if (Math.random() < propability) {
        //             this.ObjectCTX.registerWall(x, y, x, y + blockHeight);
        //         }
        //     }
        // }
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
        this.buffer.reset();
        // render foreground

        // render players
        this.ObjectCTX.Players.forEach((player) => {
            player.render(this.buffer);
        });
        this.ctxF.reset();
        this.ctxF.drawImage(this.buffer.canvas, 0, 0);
    }

    private renderBackground() {
        this.buffer.reset();

        this.buffer.fillStyle = "#E4DFDA";
        this.buffer.fillRect(0, 0, this.ctxB.canvas.width, this.ctxB.canvas.height);

        this.ObjectCTX.Walls.forEach((wall) => {
            wall.render(this.buffer);
        });

        this.ctxB.reset();
        this.ctxB.drawImage(this.buffer.canvas, 0, 0);
    }
}
