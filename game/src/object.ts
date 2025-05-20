import { ObjectContext } from "./object_context.js";

export interface Object {
    x: number;
    y: number;
    //width: number;
    //height: number;
    objectId: number;
    //collisionType: CollisionType;
    collisionRadius: number;

    ObjectCTX: ObjectContext;
}
