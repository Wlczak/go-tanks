import { Player } from "./objects/player.js";
import { Wall } from "./objects/wall.js";

export class ObjectContext {
    public Players: Player[] = [];
    public Walls: Wall[] = [];

    public borderX: number;
    public borderY: number;

    private objectIdCounter = 0;

    constructor(borderX: number, borderY: number) {
        this.borderX = borderX;
        this.borderY = borderY;
    }

    public registerPlayer(x: number, y: number, id: string, name: string, isPlayable: boolean) {
        const player = new Player(id, name, "red", x, y, 0, this, 25, this.objectIdCounter++);

        player.isPlayable = isPlayable;

        this.Players.push(player);
    }

    public registerWall(startX: number, startY: number, endX: number, endY: number) {
        const wall = new Wall(startX, startY, endX, endY, this.objectIdCounter++, this);
        this.Walls.push(wall);
    }

    public checkCollisions(intendedX: number, intendedY: number, radius: number, objectId: number): boolean {
        if (
            intendedX - radius < 0 ||
            intendedX + radius >= this.borderX ||
            intendedY - radius < 0 ||
            intendedY + radius > this.borderY
        ) {
            return false;
        }

        for (const player of this.Players) {
            if (player.objectId !== objectId) {
                const dx = intendedX - player.x - player.width / 2;
                const dy = intendedY - player.y - player.height / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < radius + player.collisionRadius) {
                    return false;
                }
            }
        }
        for (const wall of this.Walls) {
            // no clue what this does, written by chatGPT
            const A = { x: wall.startX, y: wall.startY };
            const B = { x: wall.endX, y: wall.endY };
            const C = { x: intendedX, y: intendedY };

            const ABx = B.x - A.x;
            const ABy = B.y - A.y;
            const ACx = C.x - A.x;
            const ACy = C.y - A.y;

            const ab2 = ABx * ABx + ABy * ABy;
            const t = Math.max(0, Math.min(1, (ACx * ABx + ACy * ABy) / ab2));

            const Px = A.x + ABx * t;
            const Py = A.y + ABy * t;

            const dx = C.x - Px;
            const dy = C.y - Py;

            if (dx * dx + dy * dy <= radius * radius) {
                return false;
            }
        }
        return true;
    }
}
