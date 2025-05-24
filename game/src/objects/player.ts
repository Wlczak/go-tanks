import { Controlls } from "../controlls.js";
import { Object } from "../object.js";
import { ObjectContext } from "../object_context.js";

export class Player implements Object {
    public id: string;
    public objectId: number;
    public name: string;
    public color: string;
    public x: number;
    public y: number;
    public rotation: number;
    public width: number = 36;
    public height: number = 53;
    public isAlive: boolean = true;
    public isPlayable: boolean = true;

    public ObjectCTX: ObjectContext;
    public collisionRadius: number;

    private img: HTMLImageElement;
    private Controlls: Controlls;

    // bullet stats
    public bulletsShot: number = 0;
    public maxBulletsShot: number = 10;
    public lastBulletShot: number = 0;
    public bulletCooldown: number = 250;
    public bulletLifetime: number = 10 * 1000;
    public bulletSpeed: number = 5;

    constructor(
        id: string,
        name: string,
        color: string,
        x: number,
        y: number,
        rotation: number,
        ctx: ObjectContext,
        collisionRadius: number,
        objectId: number
    ) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = rotation;

        this.objectId = objectId;
        this.collisionRadius = collisionRadius;

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
                const intendedY = this.y - Math.cos((this.rotation / 180) * Math.PI) * speed;
                const intendedX = this.x + Math.sin((this.rotation / 180) * Math.PI) * speed;

                if (
                    this.ObjectCTX.checkCollisionsBool(
                        intendedX + this.width / 2, // give coordinates at the center of the object
                        intendedY + this.height / 2,
                        this.collisionRadius,
                        this.objectId
                    )
                ) {
                    this.y = intendedY;
                    this.x = intendedX;
                }
            }
            if (this.Controlls.down) {
                const intendedY = this.y + Math.cos((this.rotation / 180) * Math.PI) * speed;
                const intendedX = this.x - Math.sin((this.rotation / 180) * Math.PI) * speed;

                if (
                    this.ObjectCTX.checkCollisionsBool(
                        intendedX + this.width / 2, // give coordinates at the center of the object
                        intendedY + this.height / 2,
                        this.collisionRadius,
                        this.objectId
                    )
                ) {
                    this.y = intendedY;
                    this.x = intendedX;
                }
            }
            if (this.Controlls.left) {
                this.rotation -= rotSpeed;
            }
            if (this.Controlls.right) {
                this.rotation += rotSpeed;
            }
            if (
                this.Controlls.space &&
                this.lastBulletShot + this.bulletCooldown < performance.now() &&
                this.bulletsShot < this.maxBulletsShot
            ) {
                this.bulletsShot++;
                setTimeout(() => {
                    this.bulletsShot--;
                }, this.bulletLifetime);
                this.lastBulletShot = performance.now();
                this.ObjectCTX.registerBullet(
                    this.x + this.width / 2 + (Math.sin((this.rotation / 180) * Math.PI) * this.width) / 1.2,
                    this.y +
                        this.height / 2 -
                        (Math.cos((this.rotation / 180) * Math.PI) * this.height) / 1.8,
                    this.rotation,
                    this.bulletSpeed,
                    this.bulletLifetime
                );
            }
        }
    }

    public render(buffer: CanvasRenderingContext2D) {
        var relX = this.x + this.width / 2;
        var relY = this.y + this.height / 2;

        if (this.isAlive) {
            buffer.save();
            buffer.translate(relX, relY);
            buffer.rotate((this.rotation * Math.PI) / 180);
            buffer.transform(this.width / this.img.width, 0, 0, this.height / this.img.height, 0, 0);
            buffer.translate(-relX, -relY);
            buffer.drawImage(this.img, relX - this.img.width / 2, relY - this.img.height / 2);

            buffer.restore();
        }

        // collider circle
        // buffer.strokeStyle = "black";
        // buffer.fillStyle = "black";
        // buffer.beginPath();
        // buffer.arc(this.x + this.width / 2, this.y + this.height / 2, this.collisionRadius, 0, 2 * Math.PI);
        // buffer.stroke();

        // buffer.fillRect(this.x, this.y, this.width, this.height);

        buffer.restore();
    }
}
