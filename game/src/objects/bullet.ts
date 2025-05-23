import { Object } from "../object.js";
import { ObjectContext } from "../object_context.js";

export class Bullet implements Object {
    x: number;
    y: number;
    speed: { xSpeed: number; ySpeed: number };
    objectId: number;
    collisionRadius: number;
    ObjectCTX: ObjectContext;

    lifetime: number;

    constructor(
        x: number,
        y: number,
        speed: { xSpeed: number; ySpeed: number },
        objectId: number,
        collisionRadius: number,
        ctx: ObjectContext,
        lifetime: number
    ) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.objectId = objectId;
        this.collisionRadius = collisionRadius;
        this.ObjectCTX = ctx;
        this.lifetime = lifetime;

        console.log(this.speed);
    }
    public update() {
        this.x += this.speed.xSpeed;
        this.y += this.speed.ySpeed;

        if (performance.now() > this.lifetime) {
            this.ObjectCTX.Bullets.splice(this.ObjectCTX.Bullets.indexOf(this), 1);
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.collisionRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}
