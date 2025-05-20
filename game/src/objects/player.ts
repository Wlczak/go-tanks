import { Controlls } from "../controlls.js";

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

    private Controlls: Controlls;

    constructor(id: string, name: string, color: string, x: number, y: number, rotation: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = rotation;

        this.Controlls = new Controlls();
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

    public render(buffer: CanvasRenderingContext2D) {
        var img = new Image();

        img.src = "player.png";

        var relX = this.x + img.width / 2;
        var relY = this.y + img.height / 2;

        buffer.fillStyle = "#E4DFDA";
        buffer.fillRect(0, 0, 800, 600);
        buffer.translate(relX, relY);
        buffer.rotate((this.rotation * Math.PI) / 180);
        buffer.translate(-relX, -relY);
        buffer.drawImage(img, this.x, this.y);
        buffer.save();

        //buffer.fillRect(this.x, this.y, this.width, this.height);
    }
}
