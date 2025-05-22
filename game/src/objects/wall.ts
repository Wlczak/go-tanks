import { ObjectContext } from "../object_context.js";

export class Wall {
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    objectId: number;
    ObjectCTX: ObjectContext;
    constructor(
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        objectId: number,
        ctx: ObjectContext
    ) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.objectId = objectId;
        this.ObjectCTX = ctx;
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }
}
