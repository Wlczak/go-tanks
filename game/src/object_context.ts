import { Object as GameObject } from "./object.js";
import { Bullet } from "./objects/bullet.js";
import { Player } from "./objects/player.js";
import { Wall } from "./objects/wall.js";

export class ObjectContext {
    public Players: Player[] = [];
    public Walls: Wall[] = [];
    public Bullets: Bullet[] = [];

    public borderX: number;
    public borderY: number;

    private objectIdCounter = 0;

    public isMultiplayer = false;
    private conn?: WebSocket;
    public isHost;

    constructor(borderX: number, borderY: number, conn: WebSocket | null, isHost: boolean) {
        this.borderX = borderX;
        this.borderY = borderY;
        this.isHost = isHost;
        if (conn != null) {
            this.isMultiplayer = true;
            this.conn = conn;
            this.connectMultiplayer();
        }
    }

    private connectMultiplayer() {
        if (this.conn == null) {
            return;
        }
        if (!this.isHost) {
            this.conn.send(JSON.stringify({ type: "download" }));
        }
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

    public checkCollisionsBool(
        intendedX: number,
        intendedY: number,
        radius: number,
        objectId: number
    ): boolean {
        return this.getCollision(intendedX, intendedY, radius, objectId) < 0;
    }

    public getCollision(intendedX: number, intendedY: number, radius: number, objectId: number): number {
        // if (
        //     intendedX - radius < 0 ||
        //     intendedX + radius >= this.borderX ||
        //     intendedY - radius < 0 ||
        //     intendedY + radius > this.borderY
        // ) {
        //     return false;
        // }

        for (const player of this.Players) {
            if (player.objectId !== objectId) {
                const dx = intendedX - player.x - player.width / 2;
                const dy = intendedY - player.y - player.height / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < radius + player.collisionRadius) {
                    return player.objectId;
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
                //console.log("collision" + wall.objectId);
                return wall.objectId;
            }
        }
        return -1;
    }

    public getCollisionObject(objectId: number): GameObject | null {
        for (const p of this.Players) {
            if (p.objectId === objectId) return p;
        }
        for (const w of this.Walls) {
            if (w.objectId === objectId) return w;
        }
        return null;
    }
    public registerBullet(x: number, y: number, angle: number, speed: number, lifetime: number) {
        //console.log("pew");
        angle = angle % 360;
        //console.log("angle", angle);

        const bullet = new Bullet(
            x,
            y,
            {
                xSpeed: -Math.sin(((angle - 180) * Math.PI) / 180) * speed,
                ySpeed: -Math.cos((angle * Math.PI) / 180) * speed,
            },
            this.objectIdCounter++,
            5,
            this,
            performance.now() + lifetime
        );
        this.Bullets.push(bullet);
    }
}
