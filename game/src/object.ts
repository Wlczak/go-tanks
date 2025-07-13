import { ObjectContext } from "./object_context.js";
import { PlayerContent } from "./objects/player.js";
import { WallContent } from "./objects/wall.js";

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

export type ContentObject = PlayerContent | WallContent;
