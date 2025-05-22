export class WallCell {
    public x: number;
    public y: number;
    public hasTopWall: boolean = true;
    public hasRightWall: boolean = true;
    public hasBottomWall: boolean = true;
    public hasLeftWall: boolean = true;
    public hasBeenVisited: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
