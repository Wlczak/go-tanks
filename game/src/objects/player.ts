import { Controlls } from "../controlls.js";
import { ObjectContext } from "../object_context.js";

export class Player {
    public id: string;
    public name: string;
    public color: string;
    public x: number;
    public y: number;
    public rotation: number;
    public width: number = 50;
    public height: number = 50;
    public isAlive: boolean = true;
    public isPlayable: boolean = true;

    private ObjectCTX: ObjectContext;

    private img: HTMLImageElement;
    private Controlls: Controlls;

    constructor(
        id: string,
        name: string,
        color: string,
        x: number,
        y: number,
        rotation: number,
        ctx: ObjectContext
    ) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = rotation;

        this.ObjectCTX = ctx;

        this.Controlls = new Controlls();
        this.img = new Image();
        this.img.src = "player.png";
    }

    public set(id: string, name: string, color: string, x: number, y: number, rotation: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    public update() {
        if (this.isPlayable) {
            var speed = 4;
            var rotSpeed = 5.5;
            if (this.Controlls.up) {
                this.y -= Math.cos((this.rotation / 180) * Math.PI) * speed;
                this.x += Math.sin((this.rotation / 180) * Math.PI) * speed;
            }
            if (this.Controlls.down) {
                this.y += Math.cos((this.rotation / 180) * Math.PI) * speed;
                this.x -= Math.sin((this.rotation / 180) * Math.PI) * speed;
            }
            if (this.Controlls.left) {
                this.rotation -= rotSpeed;
            }
            if (this.Controlls.right) {
                this.rotation += rotSpeed;
            }
        }
    }

    public render(buffer: CanvasRenderingContext2D) {
        var relX = this.x + this.img.width / 2;
        var relY = this.y + this.img.height / 2;

        buffer.save();
        buffer.translate(relX, relY);
        buffer.rotate((this.rotation * Math.PI) / 180);
        buffer.translate(-relX, -relY);
        buffer.drawImage(this.img, this.x, this.y);
        buffer.restore();

        //buffer.fillRect(this.x, this.y, this.width, this.height);
    }
}
