import { Player } from "./objects/player.js";

export class ObjectContext {
    public Players: Player[] = [];

    private borderX: number;
    private borderY: number;

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
                const dx = intendedX - player.x;
                const dy = intendedY - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < radius + player.collisionRadius) {
                    return false;
                }
            }
        }
        return true;
    }
}
