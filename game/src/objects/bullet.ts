import { Object } from "../object.js";
import { ObjectContext } from "../object_context.js";
import { Player } from "./player.js";
import { Wall } from "./wall.js";

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

        //console.log(this.speed);
    }
    public update() {
        const intendedX = this.x + this.speed.xSpeed;
        const intendedY = this.y + this.speed.ySpeed;

        const collisionObjId = this.ObjectCTX.getCollision(
            intendedX,
            intendedY,
            this.collisionRadius,
            this.objectId
        );
        if (collisionObjId >= 0) {
            const collisionObj = this.ObjectCTX.getCollisionObject(collisionObjId);

            if (collisionObj instanceof Player) {
                collisionObj.isAlive = false;
                this.ObjectCTX.Bullets.splice(this.ObjectCTX.Bullets.indexOf(this), 1);
            }
            if (collisionObj instanceof Wall) {
                //console.log("hit wall");
                const bulletAngle = (Math.atan2(intendedY - this.y, intendedX - this.x) / Math.PI) * 180;
                //console.log("bulletAngle ", bulletAngle);

                const wallAngle =
                    (Math.atan2(
                        collisionObj.endY - collisionObj.startY,
                        collisionObj.endX - collisionObj.startX
                    ) /
                        Math.PI) *
                    180;

                //console.log("wall angle", wallAngle);

                const speed = Math.sqrt(
                    Math.abs(this.speed.xSpeed * this.speed.xSpeed + this.speed.ySpeed * this.speed.ySpeed)
                );
                const reflectAngle = 2 * wallAngle - bulletAngle;
                this.speed.xSpeed = Math.cos((reflectAngle * Math.PI) / 180) * speed;
                this.speed.ySpeed = Math.sin((reflectAngle * Math.PI) / 180) * speed;
            }
        }
        this.x = intendedX;
        this.y = intendedY;

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
