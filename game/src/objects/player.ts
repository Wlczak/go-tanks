export class Player {
    public id: string;
    public name: string;
    public color: string;
    public x: number;
    public y: number;
    public rotation: number;
    public width: number = 50;
    public height: number = 50;

    constructor(id: string, name: string, color: string, x: number, y: number, rotation: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }
}
