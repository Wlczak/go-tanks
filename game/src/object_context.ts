import { Player } from "./objects/player.js";

export class ObjectContext {
    public Players: Player[] = [];

    public registerPlayer(x: number, y: number, id: string, name: string, isPlayable: boolean) {
        const player = new Player(id, name, "red", x, y, 0, this);

        player.isPlayable = isPlayable;

        this.Players.push(player);
    }
}
