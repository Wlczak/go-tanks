import { Player } from "./objects/player.js";

export class ObjectContext {
    public Players: Player[] = [];

    private objectIdCounter = 0;

    public registerPlayer(x: number, y: number, id: string, name: string, isPlayable: boolean) {
        const player = new Player(id, name, "red", x, y, 0, this, 50, this.objectIdCounter++);

        player.isPlayable = isPlayable;

        this.Players.push(player);
    }

    public checkCollisions(intendedX: number, intendedY: number) {}
}
