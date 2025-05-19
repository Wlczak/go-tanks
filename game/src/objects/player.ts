export class Player {
    public id: string;
    public name: string;
    public color: string;
    public x: number;
    public y: number;

    constructor(id: string, name: string, color: string, x: number, y: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
    }
}
